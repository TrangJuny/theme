import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

class Form {
    constructor(){
        // U must define correct wrapper whenever use this
        this.wrapper = '.eden-form';
        // Submit button selector
        this.submitBtn = '[data-control="submit"]';
        // Cancel button selector
        this.cancelBtn = '[data-control="cancel"]';
        // Attach token when submit
        this.token = '';
        // method to submit POST / GET / PUT / DELETE ...
        this.method = 'POST';
        this.methodCancel = 'GET';
        // Url to send submit
        this.url = '//google.com';
        // Url to send cancel (restore old data)
        this.urlCancel = '//google.com';
        // Data to send
        this.data = {};
        // Data to send cancel
        this.dataCancel = {};
        // Restore old data when click cancel
        this.restoreWhenCancel = true;

        this.messages = {};

        this.errorClass = "has-error"; // add by thien.nguyen. implement Validation
        this.errorTag = '<div class="help-block">';
        this.errorendTag = '</div>';
    }

    // Hooks
    beforeSubmit(){};
    done(data){};
    afterDone(data){};
    fail(data){};
    afterFail(data){};
    final(data){};
    expriedToken(data){};

    // Hooks
    beforeCancel(){};
    afterCancel(data){};
    failCancel(data){};
    finalCancel(data){};

    thenSubmit(){};

    /* loading */
    setloading(){};
    loading()
    {
        // elementLoading = this.setloading();
    }

    /**
     * Parse validation errors object from Laravel
     * @param errors (Object)
     */

    parseValidateErrors (errors) {
        let form = this
        $(this.wrapper +' [data-validation="eden-validation"]').empty();
        $(this.wrapper +' [data-validation="eden-validation"]').each(function(index){
            var is = $(this);
            var errorField = is.attr('data-field');
            
            if(index == 0){
                form.scrollToError(errorField);
            }
            
            if (errors.errors[errorField] != null){
                is.slideDown();
                for(var i = 0; i < errors.errors[errorField].length; i++){
                    is.append(form.errorTag + errors.errors[errorField][i] + form.errorendTag);
                }
                is.closest('.form-group').addClass(form.errorClass);
                is.closest('.form-group').find(".form-control").addClass("is-invalid");
            }
        });
    }

    /**
     * Remove all errors were parsed before
     */

    resetErrors () {
        $(this.wrapper +' .form-group').removeClass(this.errorClass);
        $(this.wrapper +' .form-group').find(".form-control").removeClass("is-invalid");
        $(this.wrapper +' [data-validation="eden-validation"]').empty();
    }

    /**
     * Field name that will be detected by "[data-validation="eden-validation"][data-field="{field}"]"
     * @returns {*}
     */
    scrollToError(field){
        $('html, body').animate({
            scrollTop: $(this.wrapper + ' [data-validation="eden-validation"][data-field="' + field + '"]').offset().top
        }, 1000);
    }

    /**
     * Prepare data from Form => Json. Send it to server
     */
    prepareData(){
        this.data = $(this.wrapper).serializeJSON({
            useIntKeysAsArrayIndex: true,
            parseNulls: true,
            //parseAll: true,
            parseWithFunction: (val, inputName) => {
                if(val === ''){
                    return null;
                }
                return val;
            }
        });
    }

    submit() {
        this.prepareData();
        this.beforeSubmit();
        // $(this.wrapper + ' ' + this.submitBtn).loading();
        // $(this.wrapper + ' ' + this.submitBtn).buttonLoader('start');

        this.resetErrors();
        let request = null;

        // let csrfToken = $('meta[name="csrf-token"]').attr('content');
        //{ headers: {"X-XSRF-TOKEN" : csrfToken} }

        switch (this.method) {
            case 'POST':
                request = axios.post(this.url, this.data);
                break;
            case 'PATCH':
                request = axios.patch(this.url, this.data);
                break;
            default:
                request = axios.get(this.url, {
                    params: this.data
                });
        }

        let reuseForm = this;

        this.loading();
        return request
            .then(function(data){
                reuseForm.done(data.data);
                $(reuseForm.wrapper).closest('.eden-card').find('.control-panel .switch-panel-mode').trigger('click');
                reuseForm.afterDone(data.data);
                return data;
            })
            .catch(function(data){
                /**
                 * Do some hook -> parse validation error -> scroll screen to element
                 */
                // $(reuseForm.wrapper + ' ' + reuseForm.submitBtn).buttonLoader('stop');
                // reuseForm.fail(data.response.data);
                
                if(data.response.data != null && data.response.status == 422 ){
                    reuseForm.parseValidateErrors(data.response.data);
                }

                // if(data.response.status == 419 || data.response.status == CONFIG.HTTP_CODE.STATUS_EXPIRED_TOKEN)
                //     reuseForm.expriedToken(data);

                reuseForm.afterFail(data);
                return data;
            })
            .then(function(data){ // Finally
                if(data.response != undefined){
                    reuseForm.final(data.response.data);
                } else {
                    reuseForm.final(data.data);
                }
                // $(reuseForm.wrapper + ' ' + reuseForm.submitBtn).buttonLoader('stop');
                // reuseForm.thenSubmit();
            });
    }

    /**
     * Auto handle event click on Cancel
     */
    handleCancel(){
        let reuseForm = this;
        $(this.wrapper + ' ' + this.cancelBtn).on('click', function(e) {
            e.preventDefault();
            reuseForm.cancel();
        });
    }

    /**
     * Auto handle event click on Submit
     */
    handleSubmit(){
        let reuseForm = this;
        $(this.wrapper + ' ' + this.submitBtn).on('click', function(e) {
            e.preventDefault();
            reuseForm.submit();
        });
    }

    destroyEvent(){
        $(this.wrapper + ' ' + this.submitBtn).off('click');
        $(this.wrapper + ' ' + this.cancelBtn).off('click');
    }

    /**
     * Auto push data from object _data to input / select / ...
     * @param _data
     */
    mapField(_data){
        let keys = Object.keys(_data);
        let reuseForm = this;
        keys.forEach( (field) => {
            let ctl = $(reuseForm.wrapper + ' ' + '[name="' + field + '"]');
            if(ctl){
                ctl.val(_data[field]);
            }
        });
    }

    /**
     * Handle cancel click
     */
    cancel(){
        this.beforeCancel();
        if(!this.restoreWhenCancel){
            this.resetErrors();
            this.afterCancel(null);
            this.finalCancel(null);
            return;
        }
        // $(this.wrapper + ' ' + this.cancelBtn).buttonLoader('start');
        this.resetErrors();
        let request = null;
        switch (this.methodCancel) {
            case 'POST':
                request = axios.post(this.urlCancel, this.dataCancel);
                break;
            default:
                request = axios.get(this.urlCancel, this.dataCancel);
        }
        this.loading();
        let reuseForm = this;
        return request
            .then(function(data){
                reuseForm.mapField(data.data.data);
                $(reuseForm.wrapper).closest('.eden-card').find('.control-panel .switch-panel-mode').trigger('click');
                reuseForm.afterCancel(data.data);
                return data;
            })
            .catch(function(data){
                /**
                 * Do some hook -> parse validation error -> scroll screen to element
                 */
                reuseForm.failCancel(data.response.data);
                return data;
            })
            .then(function(data){
                if(data.response != undefined){
                    reuseForm.finalCancel(data.response.data);
                } else {
                    reuseForm.finalCancel(data.data);
                }
                // $(reuseForm.wrapper + ' ' + reuseForm.cancelBtn).buttonLoader('stop');
            });
    }

    init() {
        this.handleSubmit()
        $(this.wrapper + ' ' + this.submitBtn).trigger('click');
    }
}
export default Form;
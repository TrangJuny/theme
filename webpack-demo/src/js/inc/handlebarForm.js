let Handlebars = require('handlebars');
import moment from 'moment';
Handlebars.registerHelper('ifIndex', function(v1, options) {
    if(v1 == 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});

Handlebars.registerHelper('checkImage', function(url) {
    if(url) {
        return url;
    }
    return 'https://mdbootstrap.com/img/Mockups/Lightbox/Thumbnail/img%20(67).jpg';
});

Handlebars.registerHelper('ifUnIndex', function(v1, options) {
    if(v1 != 0) {
        return options.fn(this);
    }
    return options.inverse(this);
});
Handlebars.registerHelper('paginations_li', function(maxLength, activePage, options) {
    if(maxLength==1) {return ''}
    let disablePrevious= activePage == 1 ? 'disabled ' : '';
    let disableNext= activePage == maxLength ? 'disabled ' : '';
    var out = `<nav aria-label="Page navigation example" class="col-12">
    <ul class="pagination justify-content-center page-pagination">`;
    out += `<li class="page-item ${disablePrevious}" >
                <a class="page-link" aria-label="Previous" current_page="${activePage}" >
                    <span aria-hidden="true">Trước</span>
                </a>
            </li>`;
    
    for(var i=1; i<=maxLength; i++) {
        let activeClass = activePage === i ? 'active' : '';
      out += `<li class="page-item">
                <a class="page-link ${activeClass}"   alt="${i}">${i}</a>
            </li>`;
    }
    out += ` <li class="page-item ${disableNext} ">
                <a class="page-link" aria-label="Next"  current_page="${activePage}">
                    <span aria-hidden="true">Sau</span>
                </a>
            </li>`;
    out += `</ul>
    </nav>
    `
    return out;
});
Handlebars.registerHelper("math", function(lvalue, operator, rvalue, currency=false) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);
    let num ={
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
    num = currency ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num) : num;
    return num;
});

// Handlebars.registerHelper('paginations_li', function(maxLength, activePage, options) {
//     let disableNext= activePage == maxLength ? 'd-none ' : '';
//     if(maxLength==1 || maxLength==activePage) {return ''}
//     return ` <div class="text-center"><button class="btn btn-primary page-link ${disableNext}" aria-label="Next"  current_page="${activePage}">
//                Xem thêm
//             </button></div>`
// });
Handlebars.registerHelper('formatDate', function(date) {
    return moment(date).format('MM/DD/YYYY')
});
class HandlebarRender {
    constructor(){
        this.data            = {};
        this.sourceElement   = null;
        this.templateElement = null;
        this.handlebar       = Handlebars;
    }

    /**
     * setter data.
     */
    setData(data){
        this.data = data;
    }

    /**
     * getter data.
     */
    getData(){
        return this.data;
    }

    /**
     * setter source.
     */
    setSourceElement(element){
        this.sourceElement = element;
    }

    /**
     * setter handlebar.
     */
    setHandlebar(handlebar){
        this.handlebar = handlebar;
    }

    /**
     * setter template.
     */
    setTemplateElement(element){
        this.templateElement = element;
    }

    /**
     * hook before parse template
     */
    beforeParseTemplate(){}

    /**
     * hook after parse template
     */
    afterParseTemplate(){}

    /**
     * Parse template
     */
    parseTemplate(){
        this.beforeParseTemplate();
        let source = $(this.sourceElement).html();
        let template = this.handlebar.compile(source);
        $(this.templateElement).html(template(this.data));
        this.afterParseTemplate();
    }
}

export { Handlebars, HandlebarRender };
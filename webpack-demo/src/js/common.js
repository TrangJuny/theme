// // const handleBars = require('handlebars');
// // const _ = require('lodash');
// const axios = require('axios');
// // const toastr = require('toastr');
// // window.axios = require('axios');
// // quantityBtn
// function quantityBtn(e){   
//     let count = parseInt($(e).parents(".item").siblings('.item-center').find("input").val());    
//     count = $(e).attr('title')=='plus' ? (count+1) : ( count > 1 ? count- 1 : 1);
//     $(e).parents(".item").siblings('.item-center').find("input").val(count);
// }

// function addWishList(e){
//     // Param product_id
//     alert('addWishList')
//     let proId = $(this).attr('data-id')
//     if(!proId) return false;
//     let api =$(this).hasClass('addToWishList') ? APIROOT.WISH_LIST.ADD : APIROOT.WISH_LIST.DEL
//     let request = window.axios.get( api, {params:{ product_id : proId }})
//     request.then((response)=>{
//         debugger;
//         let data = response.data.data
//         if(!data) {
//             $('#modalLoginForm').modal('show');
//         } else{            
//             $("#modalWishlist").modal('show');
//         }
//     })
// }
// function renderSmallCart(response) {
//     let source = $('#small-cart-template').html();
//     // let template = Handlebars.compile(source);
//     // $('#small-cart-wp').html(template(response));
// }
// //get cart
// function getCartItem() {    
//     let request = axios.get(APIROOT.CART.GET)
//     request.then(response => {
//         renderSmallCart(response);
//     });
// }
// //add cart
// function addCart(data){
//     // Param product_id | color_id | unit_id | size_id | delivery_date
//     let dataProduct = data ? data : $('form#product-detail').serializeJSON();
//     let request = axios.get(APIROOT.CART.ADD, {params: dataProduct})
//     request.then(response=>{
//         let data = response.data.data;        
//         if(data){
//             renderSmallCart(data);
//             // alert(response.data.message);
//             // window.location.reload()
//         }else{
//             // console.log('Oops. Something went wrong')
//             // window.location.reload()
//         }
//     })
// }
// //Remove cart
// function removeCartItem(id) {
//     // Param product_id
//     let product_id = id ? id: $(this).data('id');
//     let request = axios.get( APIROOT.CART.DEL, {params: { product_id } });
//     request.then(rspData=>{
//       let data = rspData.data.data
//       renderSmallCart(data);

//     }).catch(err => {
//       toastr.error(`<span class="remixicon-error-warning-line"></span><span>${ err }</span>`);
//     })
// }

// // Handlebars.registerHelper({
// //     getTotal: function(data) {
// //         return data.data.items ? data.data.items.length : 0;
// //     },
// //     formatMoney: function(data) {
// //         return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data);    
// //     }
// // });
const Order = require('../../../models/order')
const moment = require('moment')
function orderController(){
    return{
        store(req,res){
            // console.log(req.body)

            //Validate request
            const {phone , address} = req.body

            if(!phone || !address){
                req.flash('error','All fields are required')
                res.redirect('/cart')
            }

            const order = new Order({
                customerId : req.user._id,
                items : req.session.cart.items,
                phone,
                address
            })

            order.save().then(result =>{
                req.flash('success','Order Placed Successfully')
                delete req.session.cart
                return res.redirect('/customer/orders')
            }).catch(err=>{
                req.flash('error','Sometthing went wrong')
                return res.redirect('/cart')
            })
        },
        async index(req,res){
            const orders = await Order.find({ customerId : req.user._id },
                null,
                {sort : {'createdAt' : -1}}
                )
                res.header('Cache-Control','no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
            // console.log(orders)
            res.render('customers/orders',{orders:orders,moment : moment})
        },
        async show(req,res){
           const order = await Order.findById(req.params.id)
           
           //Authorize user
           if(req.user._id.toString() === order.customerId.toString()){
            //    console.log( JSON.stringify(order) )
              return  res.render('customers/singleOrder',{order})
           }
           return res.redirect('/')
        }
    }
}

module.exports = orderController
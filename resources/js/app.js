
import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'
// console.log('sdqsva')
// console.log("asfva")

let addTocart = document.querySelectorAll('.add-to-cart')
// console.log(addTocart)
let cartCounter = document.querySelector('#cartCounter')


function updatecart(cloth){
    axios.post('/update-cart',cloth).then(res=>{
        // console.log(res)
        cartCounter.innerText = res.data.totalQty;

        new Noty({
            type: 'success',
            timeout : 1000,
            text : "Item added",
            progressBar: false
        }).show();
    }).catch(err=>{
        new Noty({
            type: 'error',
            timeout : 1000,
            text : "Something went wrong",
            progressBar: false
        }).show();
    })
}

addTocart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        // console.log(e);
        let cloth = JSON.parse(btn.dataset.cloth);
        updatecart(cloth)
        // console.log(cloth)
    })
})

//Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    },2000)
}

initAdmin()


// Change order Status



let statuses = document.querySelectorAll('.status_line')
// console.log(statuses)

let hiddenInput = document.getElementById('hiddenInput').value

let order = hiddenInput ? hiddenInput : null
order = JSON.parse(order)
// console.log(order)

let time = document.createElement('small')


function updateStatus(order){

    statuses.forEach((status)=>{
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })

    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataPop = status.dataset.status

        if(stepCompleted){
            status.classList.add('step-completed')
        }

        if(dataPop === order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })

}

updateStatus(order)

const paymentForm = document.querySelector('#payment-form');
paymentForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    let formData = new FormData(paymentForm)
    let formObject = {}

    for(let [key,value] of formData.entries()){
        formObject[key] = value
    }
    axios.post('/orders',formObject.then(()=>{
        
    }))
    // console.log(formData)
})


//Socket

// let socket = io()

// initAdmin(socket)
// //join
// if(order){
//     socket.emit('join',`order_${order._id}`)
// }

// let adminAreaPath = window.location.pathname
// console.log(adminAreaPath)

// if(adminAreaPath.includes('admin')){
//     socket.emit('join','adminRoom')
// }

// socket.on('orderUpdated',(data)=>{
//     const updateOrder = {...order}
//     updateOrder.updatedAt = moment().format()
//     updateOrder.status = data.status
//     // console.log(data)
//     updateStatus(updateOrder)
//     new Noty({
//         type : 'success',
//         timeout : 'Order updated',
//         progressBar : false
//     }).show();
// })
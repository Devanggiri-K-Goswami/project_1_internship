const Menu = require('../../models/menu')

function homeController(){
    return{
        async index(req,res) {

            const clothes = await Menu.find()
            console.log(clothes)
              return res.render('home',{clothes:clothes})

            // Menu.find().then(function(clothes){
            //     console.log(clothes)
            // return res.render('home',{clothes:clothes})

            // })
        }
    }
}

module.exports = homeController
var models = require('../models/models.js');
var quizes = [];

//MW ppara crear nueva pregunta favorita
exports.new = function(req, res, next){
	var quiz = req.quiz; //pregunta
	var user = req.user; //user

	user.hasQuiz(quiz).then(function(sol){ //claro, hay que ver si tiene quizes el user....
		if(sol){
			next();
			return;
		} else { // si no tiene quizes el pobre...
			user.addQuiz(quiz).then(function(){ // se lo añadimos!
				user.hasQuiz(quiz).then(function(sol){
					console.log("Al " +user.id + " le gusta" + quiz.id + " con succes");
				})
			})
		}
		res.redirect(req.session.redir.toString());
	});

}
//MW para quitar una pregunta de favoritos :D
exports.destroy = function(req, res){
	var quiz = req.quiz;
	var user = req.user;

	user.hasQuiz(quiz).then(function(result){
		if(result){		
			user.removeQuiz(quiz).then(function(){
				user.hasQuiz(quiz).then(function(result){
					console.log(" El " + user.id + " ha quitado de favoritos a la pregunta " + quiz.id + " con succes");
				})
			})
		} 
		else {
		}
		res.redirect(req.session.redir.toString());
	});
}

//MW para listar preguntas favoritas
exports.listFav = function(req, res){
	var favs = [];
	var quizes2 = [];
	index = 0;
	index2 = 0;
	var idB;

		models.favourites.findAll({
			where: {UserId: Number(req.session.user.id) },//busca favoritos del usuario que inicia sesion y los guarda en a
			//order: 'QuizId ASC'
		})
		.then(function(a){
			quizes = [];
			for(index = 0; index < a.length;index++){
				favs.push(a[index].dataValues.QuizId);//guarda los id de quizes en favs[]
			}
		})
		.then(function(){
			index2 = 0;
		})
		.then(function(){
			//console.log(favs.length);
			if(favs.length > 0 ){
				for(index2 = 0; index2 < favs.length; index2++){
					idB=favs[index2];//guarda el id de quiz correspondiente en idB
					models.Quiz.find({
						where:{ id: Number(idB)},//busca el quiz correspondiente inckuyendo sus comentarios y lo guarda en quiz
						order: 'pregunta ASC',
						include: [{model: models.Comment}]
					})
					.then(function(quiz){
							quizes.push(quiz);
						})
					.then(function(){
						if(quizes.length === favs.length){// si hemos encontrado todos los favoritos...
							res.render('quizes/index.ejs', {quizes: quizes, errors: [], favs: favs});
						}
					});
				}
			} else {
				res.render('quizes/index.ejs', {quizes: quizes, errors: [], favs: favs});
			}
		});
}
var models = require('../models/models.js');


function num_quest(quizes){
	return quizes.length;
};

function num_comm(comentarios){
	return comentarios.length;
};

function cfq(q,c){
	return c.length/q.length;
}

function no_quest(q,c){ 
	var quest=[];
	for (var i =0; i<c.length; i++){
		if(quest[c[i].QuizId]) quest[c[i].QuizId]+=1;
		else quest[c[i].QuizId]=1;
		}

		full=0;
	for(var k = 0; k<quest.length; k++){
		if(quest[k]) full++;
	}

	return q.length-full;
}



// GET /quizes/statistics
exports.show = function(req,res){

	models.Quiz.findAll().then(function(quizes){

		models.Comment.findAll({where: {publicado: true}}).then(function(comment){
			if(comment ==undefined) comment = [];
			if(quizes == undefined ) quizes = [];
			var nohay= no_quest(quizes,comment);
			var questions =num_quest(quizes);

				res.render('quizes/stats.ejs',{
				questions: questions, 
				comentarios: num_comm(comment),
				media: cfq(quizes,comment),
				nohay: no_quest(quizes,comment),
				hay: questions - nohay,
				errors:[]});})

			
		});



};
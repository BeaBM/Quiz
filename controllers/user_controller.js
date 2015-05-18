var models = require('../models/models.js');


// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error).

exports.autenticar = function(login, password, callback){
	models.User.find({
		where: {username: login}
	}).then(function(user){
		if(user){
			if(user.verifyPassword(password)){
				callback(null,user);
			} else {callback(new Error('La contraseña introducida no es correcta')); }
		} else {callback(new Error('El usuario '+login+' no existe' ))}	
		}).catch(function(error){callback(error)})
};

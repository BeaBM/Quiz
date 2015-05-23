var crypto = require('crypto');
var key = 'MIIEpAIBAAKCAQEA0ZmLPL9V6r4pWZOXC3Soawr6ix4K3StnxxFaPN7bgNNxualFVlDgQiMbhS4Hu8znmYoADno+rcvWckyNVIYo0lsxAZc3lSBAVJ+3gLE15EwOYUwL7yPaMpEmyaYlSqhPV/ec947CWCN2aA9jxuSDeQYmAy/AvSm0g5bzhRSV010FGTXwPvPOff2u/3iA0UUbs6s0yrsk2EVZVdHhZYtOeNdjs4WSb0Ueb3b0TUM/o3C8wMqnshvCqMoabofw6OwHJPnbVLP9ZMwK6BAKliRZ/DwZEklRYsr7UQYQJgwfCDkYcZCgOuJMpfH8QR0W9XfAWZagbuu2u0lgco6h5H3SQwIDAQABAoIBACAkTafZJ5HB65FjAqytDQ6tNlKTHtNfzqBGVvIysrKEulHgVVOxP1KlE5lOv7za5UE0WmHd+TKpqY8Jkjq+ABCSD2fRCqMBuRvBCmDfzAXga+wbv1DCzLkobSxLIDjcqp4wyI9mAwOFHKlEguaDMG4ktTuT3RilBpuPUHS9/WPV/tEW8zuny/NB+FK7BmFmDE6DfOqGdDFiKJQGOm/kMzCreW8iHHlNmCbrjztr2/TmQUgyRCnNFd9+vnBab1i3+5eQDwqJCvc2+SAz/N5LecU4oKJkxMiPUD+ItcA4yECwJiSNLMHMGyqWxz9V0NXen6GpwaAhxFDiyPWu/LzH4IECgYEA8XJaeSODJUfXO/UycBe/oE/jJj4FwURmd7b97vLhYNOvGJbD12HJKXi10ZTItFnIRaNXazy30a/PrlxRsDRGEh5tPtXlOZYPBlZoA3i0MQD59YRDh6w3rCLZLpFoBNTxTzpC617phRTWY55QzoMd6F8X9LLSkFrALLBkk10FZiECgYEA3jvGuOm+AYYV2hWmriKCOp+/0XdG0cbBia8pKrA9ikea3d7El/dfSeBllUWEsrM2FqoFCEn0BdhokUjAhp/HHVW6JBi2EbJC8b1963HLc81lwNkHfXcYW5bk9vQzZjliNJdAOT3DxZz6vZ6K3Wsuc3THcFXd1pSF5Qk7+pCF4+MCgYAqBlxm/15hS8rTvc7koc2RyrXfvyXjSNOI/MngIFhIMTAl2IAH6hZIaKFE9F+mvIXWUSLzIGNiVPaSA7GYONEFcFRVfodiaZL96GY8THMYoHHhYP8cC0a5aGti5p4zURkbUCm7rA57QnA6cKDiAQJgosSZq9Jom9MdNCqdV7CL4QKBgQCuu59XOumbdxrtW0Kv/hAZGgwPHVKAlF8N67xZhTMN65kXxBUdS3IPuzED+iIJA6GOlmXYi5Ujl3E4clR2RWCgbwwpX4igR2IdgplkKxgF2ESeKcaa3q43LWCfz4guYwYVRatIloi8ct4vg126FJD0VKiPaeQ/2I2idO1E6KdtcwKBgQCoUwi5hKTNGGtqTeAW4jfg9hC6tUoaEyH1l8LANu/OrzANbc3Y0SA1EGc1hVdoDbwYnaHdMhilimYobM7Vv1FIShBkcl95KXrVp87bHi/GlQgj4moq7Z2sXLb2+Llf4e7DSm4Di7xEjZgHurk/6L0xVkpYp3SEPUdhcJtcVz8F1w==';
module.exports = function(sequelize, DataTypes){
	var User = sequelize.define(
		'User',
		{ 
			username: {
				type: DataTypes.STRING,
				unique: true,
				validate: { notEmpty: {msg: "->Falta username"},
					//devuelve mensaje de error si username ya existe
					isUnique: function(value, next){
						var self = this;
						User
						.find({where: {username: value}})
						.then(function(user){
							if(user && self.id !== user.id) {
								return next('Username ya utilizado');
							}
							return next();
						}).catch(function(err){return next(err);});
					}
				}
			},
			password: {
				type: DataTypes.STRING,
				validate: { notEmpty: {msg: "->No has metido la password,majo!"}},
				set: function(password){
					var encripted = crypto
									.createHmac('sha1',key)
									.update(password)
							.digest('hex');
					//Evita  vacíos
					if(password === '') {encripted = '';}
					this.setDataValue('password',encripted);				
					
				}
			},
			isAdmin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			}
		},
		{
			instanceMethods: {
				verifyPassword: function(password){
					var encripted = crypto.createHmac('sha1',key)
									.update(password)
									.digest('hex');
					return encripted == this.password;
				}
			}
		}
	);
	return User;
}

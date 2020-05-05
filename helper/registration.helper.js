var methods = {
    validateInput: (registrationRequestDTO) => {
        var validator = new RegExp('[a-zA-Z]+');
        var messages = [];
        if(registrationRequestDTO != null && registrationRequestDTO != undefined){
            if(!registrationRequestDTO.firstname || !registrationRequestDTO.lastname || registrationRequestDTO.firstname != validator.exec(registrationRequestDTO.firstname)
                || registrationRequestDTO.lastname != validator.exec(registrationRequestDTO.lastname)){
                messages.push({messageDetail: 'Please enter alphabets only.'});
            }

            validator = new RegExp('\\d{10}');
            if(!registrationRequestDTO.phone || registrationRequestDTO.phone != validator.exec(registrationRequestDTO.phone)){
                messages.push({messageDetail: 'Your phone number must contain 10 digits only.'});
            }

            validator = new RegExp('^(?=.*[a-zA-Z]+)(?=.*.).*$');
            if(!registrationRequestDTO.username || registrationRequestDTO.username != validator.exec(registrationRequestDTO.username)){
                messages.push({messageDetail: 'Your username must contain at least one alphabet.'});
            }

            validator = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).*$');
            if(!registrationRequestDTO.password || registrationRequestDTO.password != validator.exec(registrationRequestDTO.password)){
                messages.push({messageDetail: 'Your password must contain a combination of uppercase, lowercase, digits and special characters.'});
            }

            validator = new RegExp('^(?=.*\\D$)(?=.*^\\D).*$');
            if(!registrationRequestDTO.password || registrationRequestDTO.password != validator.exec(registrationRequestDTO.password)){
                messages.push({messageDetail: 'Your password cannot begin or end with digits.'});
            }

            validator = new RegExp('([^@]+)([@])([a-zA-Z\d]+)([.])([a-zA-Z\d]+)');
            if(!registrationRequestDTO.email || registrationRequestDTO.email != validator.exec(registrationRequestDTO.email)[0]){
                messages.push({messageDetail: 'Please enter a valid email address.'});
            }
        }

        return messages;
    }
};

module.exports = methods;
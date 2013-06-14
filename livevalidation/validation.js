
~function(win, doc, undefined) {

var TYPE = {
	textarea: 1,
	text: 2,
	password: 3,
	checkbox: 4,
	select: 5,
	file: 6	
}

function noop(){}

function $(id) {
	return typeof id === 'string' ? doc.getElementById(id) : id
}

function ZVError(errorMsg) {
	this.message = errorMsg
	this.name = 'ValidationError'
}

function Validation(elem, option) {
	this.initialize(elem, option)
}
Validation.massValidate = function(validations) {
	var returnValue = true
	for (var i = 0, len = validations.length; i < len; ++i ) {
		var valid = validations[i].validate()
		if (returnValue) returnValue = valid
	}
	return returnValue
}
Validation.prototype = {
	validClass: 'ZV_valid',
	invalidClass: 'ZV_invalid',
	messageClass: 'ZV_validation_msg',
	validFieldClass: 'ZV_valid_field',
	invalidFieldClass: 'ZV_invalid_field',
	initialize: function(elem, option) {
		var self = this
		if (!elem) {
			throw new Error('Validation::initialize - No element reference or id has been provided!')
		}
		this.element = elem.nodeName ? elem : $(elem)
		if (!this.element) {
			throw new Error('Validation::initialize - No element with reference or id of ' + elem + ' exists!')
		}
		// default properties that could not be initialised above
		this.validations = []
		this.elementType = this.getType()
		this.form = this.element.form
		// options
		var option = option || {}
		this.validMsg = option.validMsg || 'OK'
		var node = option.insertAfterWhatNode || this.element
		this.insertAfterWhatNode = node.nodeType ? node : $(node)
		this.onlyOnBlur = option.onlyOnBlur || false
		this.wait = option.wait || 0
		this.onlyOnSubmit = option.onlyOnSubmit || false
		// hooks
		this.beforeValidation = option.beforeValidation || noop
		this.beforeValid = option.beforeValid || noop
		this.onValid = option.onValid || function() {
			this.insertMessage(this.createMessage())
			this.addFieldClass()
		}
		this.afterValid = option.afterValid || noop
		this.beforeInvalid = option.beforeInvalid || noop
		this.onInvalid = option.onInvalid || function() {
			this.insertMessage(this.createMessage())
			this.addFieldClass()
		}
		this.afterInvalid = option.afterInvalid || noop
		this.afterValidation = option.afterValidation || noop
		// add to form if it has been provided
		if (this.form) {
			this.formObj = ValidationForm.getInstance(this.form)
			this.formObj.addField(this)
		}
		// collect old events
		this.oldOnFocus  = this.element.onfocus || noop
		this.oldOnBlur   = this.element.onblur || noop
		this.oldOnClick  = this.element.onclick || noop
		this.oldOnChange = this.element.onchange || noop
		this.oldOnKeyup  = this.element.onkeyup || noop
		this.element.onfocus = function(e) {
			self.doOnFocus(e)
			return self.oldOnFocus.call(this, e)
		}
		if (!this.onlyOnSubmit) {
			switch (this.elementType) {
				case TYPE.checkbox:
					this.element.onclick = function(e) {
						self.validate()
						return self.oldOnClick.call(this, e)
					}
				// let it run into the next to add a change event too
				case TYPE.select:
				case TYPE.file:
					this.element.onchange = function(e) {
						self.validate()
						return self.oldOnChange.call(this, e)
					}
					break;
				default:
					if (!this.onlyOnBlur) {
						this.element.onkeyup = function(e) {
							self.deferValidation()
							return self.oldOnKeyup.call(this, e)
						}
					}
					this.element.onblur = function(e) {
						self.doOnBlur(e)
						return self.oldOnBlur.call(this, e)
					}
			}
		}
	},
	destroy: function() {
		if (this.formObj) {
			// remove the field from the ValidationForm
			this.formObj.removeField(this)
			// destroy the ValidationForm if no Validation fields left in it
			this.formObj.destroy()
		}
		// remove events - set them back to the previous events
		this.element.onfocus = this.oldOnFocus
		if (!this.onlyOnSubmit) {
			switch (this.elementType) {
				case TYPE.checkbox:
					this.element.onclick = this.oldOnClick
				// let it run into the next to add a change event too
				case TYPE.select:
				case TYPE.file:
					this.element.onchange = this.oldOnChange
					break;
				default:
					if (!this.onlyOnBlur) {
						this.element.onkeyup = this.oldOnKeyup
					} 
					this.element.onblur = this.oldOnBlur
			}
		}
		this.validations = []
		this.removeMessageAndFieldClass()
	},
	add: function(validateFunc, validateOption) {
		this.validations.push( {type: validateFunc, params: validateOption || {} } )
		return this
	},
	remove: function(validateFunc, validateOption) {
		var victimless = []
		for ( var i = 0, len = this.validations.length; i < len; i++) {
			var v = this.validations[i]
			if (v.type != validateFunc && v.params != validateOption) {
				victimless.push(v)
			}
		}
		this.validations = victimless
		return this
	},
	deferValidation: function(e) {
		if (this.wait >= 300) {
			this.removeMessageAndFieldClass();
		}
		var self = this;
		if (this.timeout) {
			clearTimeout(self.timeout)
		}
		this.timeout = setTimeout(function(){ 
			self.validate()
		}, self.wait);
	},
	doOnBlur: function(e) {
		this.focused = false;
		this.validate(e);
	},
	doOnFocus: function(e) {
		this.focused = true;
		this.removeMessageAndFieldClass();
	},
	getType: function() {
		var nn = this.element.nodeName.toUpperCase()
		var nt = this.element.type.toUpperCase()
		switch (true) {
			case (nn == 'TEXTAREA'):
				return TYPE.textarea;
			case (nn == 'INPUT' && nt == 'TEXT'):
				return TYPE.text;
			case (nn == 'INPUT' && nt == 'PASSWORD'):
				return TYPE.password;
			case (nn == 'INPUT' && nt == 'CHECKBOX'):
				return TYPE.checkbox;
			case (nn == 'INPUT' && nt == 'FILE'):
				return TYPE.file;
			case (nn == 'SELECT'):
				return TYPE.select;
			case (nn == 'INPUT'):
				throw new Error('Validation::getType - Cannot use Validation on an ' + nt.toLowerCase() + ' input!');
			default:
				throw new Error('Validation::getType - Element must be an input, select, or textarea - ' + nn.toLowerCase() + ' was given!');
		}
	},
	doValidations: function() {
		this.validationFailed = false;
		for (var i = 0, len = this.validations.length; i < len; ++i) {
			this.validationFailed = !this.validateElement(this.validations[i].type, this.validations[i].params)
			if (this.validationFailed) {
				return false
			} 
		}
		this.message = this.validMsg
		return true
	},
	validateElement: function(validateFunc, validateOption) {
		// check whether we should display the message when empty
		switch (validateFunc) {
			case Validate.presence:
			case Validate.confirmation:
			case Validate.acceptance:
				this.displayMessageWhenEmpty = true;
				break;
			case Validate.Custom:
				if (validateOption.displayMessageWhenEmpty) {
					this.displayMessageWhenEmpty = true;
				}
				break;
		}
		// select and checkbox elements vals are handled differently
		var val = (this.elementType == TYPE.select) ? 
					this.element.options[this.element.selectedIndex].value : this.element.value; 
		if (validateFunc == Validate.acceptance) {
			var msg = 'Validation::validateElement - Element to validate acceptance must be a checkbox!'
			if (this.elementType != TYPE.checkbox) {
				throw new Error(msg);
			}
			val = this.element.checked;
		}
		// now validate
		var isValid = true;
		try {
			validateFunc(val, validateOption)
		} catch(error) {
			if (error instanceof ZVError) {
				if ( val !== '' || (val === '' && this.displayMessageWhenEmpty) ) {
					this.validationFailed = true;
					// Opera 10 adds stacktrace after newline
					this.message = error.message.split('\n')[0];
					isValid = false;
					console.log(error)
				}
			} else {
				throw error
			}
			
		} finally {
			return isValid
		}
	},
	validate: function(){
		if (!this.element.disabled) {
			this.beforeValidation()
			var isValid = this.doValidations()
			if (isValid) {
				this.beforeValid()
				this.onValid()
				this.afterValid()
				return true
			} else {
				this.beforeInvalid()
				this.onInvalid()
				this.afterInvalid()
				return false
			}
			this.afterValidation()
		} else {
			return true
		}
	},
	enable: function() {
		this.element.disabled = false
		return this
	},
	disable: function() {
		this.element.disabled = true
		this.removeMessageAndFieldClass()
		return this
	},
	createMessage: function() {
		var span = doc.createElement('span')
		var textNode = doc.createTextNode(this.message)
		span.appendChild(textNode)
		return span
	},
	insertMessage: function(elementToInsert) {
		this.removeMessage();
		// dont insert anything if vaalidMesssage has been set to false or empty string
		if (!this.validationFailed && !this.validMsg) return;
		if ( (this.displayMessageWhenEmpty && (this.elementType == TYPE.checkbox || this.element.value == ''))
			 || this.element.value != '' ) {
			var className = this.validationFailed ? this.invalidClass : this.validClass;
			elementToInsert.className += ' ' + this.messageClass + ' ' + className;
			var parent = this.insertAfterWhatNode.parentNode;
			if (this.insertAfterWhatNode.nextSibling) {
				parent.insertBefore(elementToInsert, this.insertAfterWhatNode.nextSibling);
			} else {
				parent.appendChild(elementToInsert);
			}
		}
	},
	addFieldClass: function() {
		this.removeFieldClass()
		if (!this.validationFailed) {
			if (this.displayMessageWhenEmpty || this.element.value != '') {
				if (this.element.className.indexOf(this.validFieldClass) == -1) {
					this.element.className += ' ' + this.validFieldClass
				}
			}
		} else {
			if (this.element.className.indexOf(this.invalidFieldClass) == -1) {
				this.element.className += ' ' + this.invalidFieldClass
			}
		}
	},
	removeMessage: function() {
		var nextEl
		var el = this.insertAfterWhatNode
		while (el.nextSibling) {
			if (el.nextSibling.nodeType === 1) {
				nextEl = el.nextSibling
				break;
			}
			el = el.nextSibling
		}
		if (nextEl && nextEl.className.indexOf(this.messageClass) != -1) {
			this.insertAfterWhatNode.parentNode.removeChild(nextEl)
		}
	},
	removeFieldClass: function() {
		var cn = this.element.className
		if (cn.indexOf(this.invalidFieldClass) != -1) {
			this.element.className = cn.split(this.invalidFieldClass).join('')
		}
		if (cn.indexOf(this.validFieldClass) != -1) {
			this.element.className = cn.split(this.validFieldClass).join(' ')
		}
	},
	removeMessageAndFieldClass: function() {
		this.removeMessage()
		this.removeFieldClass()
	}
}

function ValidationForm(elem) {
	this.initialize(elem)
}
ValidationForm.instances = {}
ValidationForm.getInstance = function(elem) {
	if (!elem) {
		throw new Error('ValidationForm::getInstance - No element reference or id has been provided!')
	}
	var el = elem.nodeName ? elem : $(elem)
	var rand = Math.random() * Math.random()
	if (!el.id){
		el.id = 'formId_' + rand.toString().replace(/\./, '') + new Date().valueOf()
	}
	if (!ValidationForm.instances[el.id]) {
		ValidationForm.instances[el.id] = new ValidationForm(el)
	}
	return ValidationForm.instances[el.id]
}
ValidationForm.prototype = {
	beforeValidation: noop,
	onValid: noop,
	onInvalid: noop,
	afterValidation: noop,
	initialize: function(elem) {
		this.name = elem.id;
		this.element = elem;
		this.fields = [];
		// preserve the old onsubmit event
		this.oldOnSubmit = this.element.onsubmit || noop;
		var self = this
		this.element.onsubmit = function(e) {
			var ret = false
			self.beforeValidation(),
			self.valid = Validation.massValidate(self.fields);
			self.valid ? self.onValid() : self.onInvalid();
			self.afterValidation();
			if (self.valid) {
				ret = self.oldOnSubmit.call(this, e || win.event) !== false
			}
			if (!ret) {
				return ret
			}
		}
	},
	addField: function(field) {
		this.fields.push(field)
	},
	removeField: function(victim) {
		var victimless = []
		for ( var i = 0, len = this.fields.length; i < len; i++) {
			if (this.fields[i] !== victim) {
				victimless.push(this.fields[i])
			}
		}
		this.fields = victimless
	},
	destroy: function(force) {
		// only destroy if has no fields and not being forced
		if (this.fields.length != 0 && !force) return false
		// remove events - set back to previous events
		this.element.onsubmit = this.oldOnSubmit
		// remove from the instances namespace
		ValidationForm.instances[this.name] = null
		return true
	}
}

var Validate = {
	presence: function(val, option) {
		var option = option || {}
		var msg = option.failureMsg || '不能为空!'
		if (val === '' || val === null || val === undefined) {
			Validate.fail(msg)
		}
		return true
	},
	numericality: function(val, option) {
		var suppliedValue = val
		var val = Number(val)
		var option = option || {}
		var min = ((option.min) || (option.min == 0)) ? option.min : null
		var max = ((option.max) || (option.max == 0)) ? option.max : null
		var is = ((option.is) || (option.is == 0)) ? option.is : null
		var notANumberMsg = option.notANumberMsg || '必须是数字!'
		var notAnIntegerMsg = option.notAnIntegerMsg || '必须为整数!'
		var wrongNumberMsg = option.wrongNumberMsg || '必须为' + is + '!'
		var tooLowMsg = option.tooLowMsg || '不能小于' + min + '!'
		var tooHighMsg = option.tooHighMsg || '不能大于' + max + '!'
		
		if (!isFinite(val)) {
			Validate.fail(notANumberMsg)
		}
		
		if (option.onlyInteger && (/\.0+$|\.$/.test(String(suppliedValue)) || val != parseInt(val)) ) {
			Validate.fail(notAnIntegerMsg)
		}
		
		switch (true) {
			case (is !== null):
				if ( val != Number(is) ) Validate.fail(wrongNumberMsg)
				break;
			case (min !== null && max !== null):
				Validate.numericality(val, {tooLowMsg: tooLowMsg, min: min})
				Validate.numericality(val, {tooHighMsg: tooHighMsg, max: max})
				break;
			case (min !== null):
				if ( val < Number(min) ) Validate.fail(tooLowMsg)
				break;
			case (max !== null):
				if ( val > Number(max) ) Validate.fail(tooHighMsg)
				break;
		}
		return true
	},
	format: function(val, option) {
		var val = String(val)
		var option = option || {}
		var message = option.failureMsg || '格式不对!'
		var pattern = option.pattern || /./
		var negate = option.negate || false
		if (!negate && !pattern.test(val)) Validate.fail(message) // normal
		if (negate && pattern.test(val)) Validate.fail(message)   // negated
		return true
	},
	email: function(val, option) {
		var option = option || {}
		var reg = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i
		var message = option.failureMsg || '必须为一个有效的电子邮箱地址!'
		Validate.format(val, {failureMsg: message, pattern: reg})
		return true
	},
	size: function(val, option) {
		var val = String(val)
		var option = option || {}
		var min = ((option.min) || (option.min == 0)) ? option.min : null
		var max = ((option.max) || (option.max == 0)) ? option.max : null
		var is  = ((option.is) || (option.is == 0)) ? option.is : null
		var wrongLengthMessage = option.wrongLengthMessage || '必须是' + is + '个字符长度!'
		var tooShortMessage = option.tooShortMessage || '不能小于' + min + '个字符长度!'
		var tooLongMessage = option.tooLongMessage || '不能大于' + max + '个字符长度!'
		switch (true) {
			case (is !== null):
				if ( val.length != Number(is) ) Validate.fail(wrongLengthMessage);
				break;
			case (min !== null && max !== null):
				Validate.size(val, {tooShortMessage: tooShortMessage, min: min});
				Validate.size(val, {tooLongMessage: tooLongMessage, max: max});
			break;
				case (min !== null):
				if ( val.length < Number(min) ) Validate.fail(tooShortMessage);
			break;
				case (max !== null):
				if ( val.length > Number(max) ) Validate.fail(tooLongMessage);
				break;
			default:
				throw new Error('Validate::size - size(s) to validate against must be provided!');
		}
		return true
	},
	inclusion: function(val, option) {
		var option = option || {}
		var message = option.failureMsg || '必须是列表中指定的元素!'
		var caseSensitive = (option.caseSensitive === false) ? false : true
		if (option.allowNull && val == null) {
			return true
		}
		if (!option.allowNull && val == null) {
			Validate.fail(message)
		}
		var within = option.within || [];
		//if case insensitive, make all strings in the array lowercase, and the val too
		if (!caseSensitive) { 
			var lowerWithin = []
			for (var j = 0, length = within.length; j < length; ++j) {
				var item = within[j]
				if (typeof item == 'string') {
					item = item.toLowerCase()
				}
				lowerWithin.push(item)
			}
			within = lowerWithin;
			if (typeof val == 'string') {
				val = val.toLowerCase()
			}
		}
		var found = false
		for (var i = 0, length = within.length; i < length; ++i) {
			if (within[i] == val) found = true;
			if (option.partialMatch) { 
				if (val.indexOf(within[i]) != -1) found = true;
			}
		}
		if ( (!option.negate && !found) || (option.negate && found) ) {
			Validate.fail(message)
		}
		return true
	},
	exclusion: function(val, option) {
		var option = option || {}
		option.failureMsg = option.failureMsg || '不能输入列表中的元素!'
		option.negate = true
		Validate.inclusion(val, option)
		return true
	},
	confirmation: function(val, option) {
		if (!option.match) {
			throw new Error('Validate::Confirmation - Error validating confirmation: Id of element to match must be provided!')
		}
		var option = option || {}
		var message = option.failureMsg || 'Does not match!'
		var match = option.match.nodeName ? option.match : $(option.match)
		if (!match) {
			throw new Error('Validate::Confirmation - There is no reference with name of, or element with id of ' + option.match + '!')
		}
		if (val != match.value) {
			Validate.fail(message)
		}
		return true
	},
	acceptance: function(val, option) {
		var option = option || {}
		var message = option.failureMsg || '必须同意!'
		if (!val) {
			Validate.fail(message)
		}
		return true
	},
	fail: function(errorMsg) {
		throw new ZVError(errorMsg)
	}
}

// exports
win.Validation = Validation
win.ValidationForm = ValidationForm
win.Validate = Validate

}(this, document);
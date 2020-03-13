'use strict'

class JQuerySelectedElements {

    constructor(elements) {
        this.elements = elements;
        this.initialDisplayValues = this.elements.map(element => {
            window.getComputedStyle(element).display;
        });
    }

    _applyToElements(action) {
        this.elements.forEach((currentValue, _currentIndex, _listObj) => {
            action(currentValue);
        });
    }

    _processClass(className, action) {
        const classesToProcess = className.split(' ');

        this._applyToElements(element => {
            classesToProcess.forEach(classToProcess => { 
                action(element, classToProcess);
            });
        });

        return this;
    }

    addClass(className) {
        return this._processClass(className, (currentValue, classToAdd) => {
            currentValue.classList.add(classToAdd);
        });
    }

    removeClass(className) {
        return this._processClass(className, (currentValue, classToRemove) => {
            currentValue.classList.remove(classToRemove);
        });
    }

    append(content) {
        if (content instanceof JQuerySelectedElements) {
            this.elements.forEach((currentValue, currentIndex, listObj) => {
                content.elements.forEach((contentElement, _contentIndex, _contentListObj) => {
                    let element;
                    if (currentIndex != listObj.length - 1) {
                        element = contentElement.cloneNode(true);
                    } else {
                        element = contentElement;
                    }
    
                    currentValue.appendChild(element);
                });
            });
        } else {
            this._applyToElements(element => {
                element.insertAdjacentHTML('beforeend', content);
            });
        }

        return this;
    }

    remove() {
        this._applyToElements(element => {
            element.remove();
        });

        return this;
    }

    text(text) {
        this._applyToElements(element => {
            element.textContent = text;
        });

        return this;
    }

    attr(attributeName, value) {
        if (value !== undefined) {
            return this._setAttr(attributeName, value);
        } 

        if (this.elements.length !== 0) {
            return this.elements[0].getAttribute(attributeName);
        }

        return null;
    }

    _setAttr(attributeName, value) {
        this._applyToElements(element => {
            if (value === null) {
                element.removeAttribute(attributeName);
            } else {
                element.setAttribute(attributeName, value);
            }
        });

        return this;
    }

    children() {
        const allChildNodes = Array.from(this.elements).flatMap(currentValue => {
            return Array.from(currentValue.childNodes);
        }).filter(node => node.nodeType != Node.TEXT_NODE);

        return new JQuerySelectedElements(allChildNodes);
    }

    empty() {
        this._applyToElements(element => {
            element.innerHTML = '';
        });

        return this;
    }

    css(property) {
        if (this.elements.length !== 0) {
            if (typeof property === 'string') {
                console.log(this.elements[0])
                return window.getComputedStyle(this.elements[0])[property];
            } else if (property instanceof Array) {
                return property.map(propertyName => window.getComputedStyle(this.elements[0])[propertyName]);
            } else if (property instanceof Object) {
                return this._setCss(property);
            }
        }
    }

    _setCss(properties) {
        Object.keys(properties).forEach(property => {
            this._applyToElements(element => {
                element.style[property] = properties[property];
            });
        });

        return this;
    }

    click(handler) {
        if (handler === undefined) {
            return this._triggerClick();
        } else {
            this._applyToElements(element => {
                element.addEventListener('click', handler);
            });
        }
    }

    _triggerClick() {
        this._applyToElements(element => {
            element.click();
        });
    }

    each(callback) {
        this.elements.forEach((currentValue, currentIndex, _listObj) => {
            callback.call(currentValue, currentIndex, currentValue);
        });

        return this;
    }

    toggle(display) {
        this.elements.forEach((element, index) => {
            if (display === true) {
                element.style.display = this.initialDisplayValues[index];
            } else if (display === false) {
                element.style.display = 'none';
            } else if (display === undefined) {
                if (window.getComputedStyle(element).display === 'none') {
                    element.style.display = this.initialDisplayValues[index];
                } else {
                    element.style.display = 'none';
                }
            }
        });    
        
        return this;
    }

    wrap() {
        
    }
}

function $(selector) {
    if (typeof selector === 'string') {
        return new JQuerySelectedElements(Array.from(document.querySelectorAll(selector)));
    } else {
        return new JQuerySelectedElements([selector]);
    }
}

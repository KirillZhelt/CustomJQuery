
class JQuerySelectedElements {

    constructor(elements) {
        this.elements = elements;
    }

    applyToElements(action) {
        this.elements.forEach((currentValue, _currentIndex, _listObj) => {
            action(currentValue);
        });
    }

    processClass(className, action) {
        const classesToProcess = className.split(' ');

        this.applyToElements(element => {
            classesToProcess.forEach(classToProcess => { 
                action(element, classToProcess);
            });
        });

        return this;
    }

    addClass(className) {
        return this.processClass(className, (currentValue, classToAdd) => {
            currentValue.classList.add(classToAdd);
        });
    }

    removeClass(className) {
        return this.processClass(className, (currentValue, classToRemove) => {
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
            this.applyToElements(element => {
                element.insertAdjacentHTML('beforeend', content);
            });
        }

        return this;
    }

    remove() {
        this.applyToElements(element => {
            element.remove();
        });
    }

    text(text) {
        this.applyToElements(element => {
            element.textContent = text;
        })
    }


}

function $(selector) {
    return new JQuerySelectedElements(document.querySelectorAll(selector));
}

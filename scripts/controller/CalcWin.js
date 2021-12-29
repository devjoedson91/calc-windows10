class CalcWin {

    constructor() {
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalcEl = document.querySelector('#display');
        this._displayCalc = '0';
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();

    }

    pasteFromClipBoard() {

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        });
    }

    copyToClipBoard() {

        let input = document.createElement('input');
        input.value = this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();

    }

    initialize() {

        this.setLastNumberToDisplay();
        this.pasteFromClipBoard();

    }

    initKeyboard() {

        document.addEventListener('keyup', e=>{

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':  
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case ',':
                case '.':
                    this.addDot();
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;
                case 'c':
                    if (e.ctrlKey) this.copyToClipBoard();
                    break;
    
            }
        });

    }

    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperation = '';
        this.setLastNumberToDisplay();
        
    }

    clearEntry() {

        this._operation.pop();
        this.setLastNumberToDisplay();

    }

    getLastOperation() {

        return this._operation[this._operation.length - 1];

    }

    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;
    }

    isOperator(value) {

        return (['+','-','*','/','%','±'].indexOf(value) > - 1);

    }

    pushOperation(value) {

        this._operation.push(value);

        if (this._operation.length > 3) {

            this.calc();

        }
    }

    getResult() {

        try{

            return eval(this._operation.join(""));

        } catch(e) {

            setTimeout(()=>{

                this.setError();

            },1);

        }
    }

    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem,this._lastOperator,this._lastNumber];
        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if (last == '%') {
            
            result /= 100;
            this._operation = [result];

        } else {
            this._operation = [result.toFixed(9)];
            if (last) this._operation.push(last);  
        }

        this.setLastNumberToDisplay();
        

    }

    getLastItem(isOperator = true) {

        let lastItem;

         for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) == isOperator) {

                //console.log('operador: '+this._operation[i]);

                lastItem = this._operation[i];
                break;

            }

         }

         if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
         }

         return lastItem;


    }

    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);
        
        console.log(lastNumber);

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                setLastOperation(value);

            } else {

                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                this.setLastNumberToDisplay();
            }

            
        }


    }

    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;

        if (this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.');
        } else {

            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();

    }

    potencia() {

        let numbr = this._operation;
        numbr.forEach(value => {

            value *= value;
            this.displayCalc = value.toString();
        });
        
    }

    raiz() {

        let numbr = this._operation;
        numbr.forEach(value => {

            let raiz = Math.sqrt(value);
            this.displayCalc = raiz.toString();
        });
        
    }

    oneForX() {

        console.log(this._operation.toString());

        let number = this._operation;
        number.forEach(value => {

            value = 1/value;
            
            if (value.toString().length > 11) {

                this.displayCalc = value.toFixed(9).toString();
                
            } else if (value.toString().length < 11){

                this.displayCalc = value.toString();
            }

            
        });

    }
    
    execBtn(value) {

        switch (value) {
            case 'C':
                this.clearAll();
                break;
            case 'CE':
                this.clearEntry();
                break;
            case '+':
                this.addOperation('+');
                break;
            case '-':
                this.addOperation('-');
                break;
            case '*':
                this.addOperation('*');
                break;
            case '/':
                this.addOperation('/');
                break;
            case '%':
                this.addOperation('%');
                break;
            case ',':
                this.addDot('.');
                break;
            case 'x²':
                this.potencia('x²');
                break;
            case '√':
                this.raiz('√');
                break;
            case '±':
                this.addOperation('±');
                break;
            case '¹/x':
                this.oneForX();
                break;
            case '=':
                this.calc();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;

        }
    }

    setError() {

        this.displayCalc = 'Error';
    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event=>{

            element.addEventListener(event,fn);
        });

    }

    initButtonsEvents() {

        let buttons = document.querySelectorAll('.row > button');

        buttons.forEach(btn=>{

            this.addEventListenerAll(btn, 'click drag', e=>{
                let textBtn = btn.innerHTML;
                this.execBtn(textBtn);
            });
        });
    }

    get displayCalc() {

        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {

        if (value.toString().length > 11) {

            this.setError();
            return false;

        }

        this._displayCalcEl.innerHTML = value;
    }
}
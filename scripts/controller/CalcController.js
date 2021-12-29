class CalcController {
    // o constructor funciona assim que o codigo é executado no navegador
    constructor() { 
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._displayCalc;
        this._currentDate;
        this._displayCalcEl = document.querySelector('#display');
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();

    }

    pasteFromClipboard() {

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
        });
    }

    copyToClipboard() {

        let input = document.createElement('input');
        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();
        document.execCommand("Copy");

        input.remove();
    }

    initialize() {

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
    }

    initKeyBoard() {

        document.addEventListener('keyup', e=> {

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
                    case 'Enter':
                    case '=':
                        this.calc();
                        break;
                    case ',':
                    case '.':
                        this.addDot('.');
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
                        if (e.ctrlKey) this.copyToClipboard();
                        break;
            
            }
        
           
        });
    }

    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry() {

        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    getLastOperation() {

        return this._operation[this._operation.length - 1]; // extraindo o ultimo item do array
    }

    setLastOperation(value) {

        this._operation[this._operation.length - 1] = value;

    }

    isOperator(value) {

        return (['+','-','*','/','%','.'].indexOf(value) > -1);

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
            console.log('firstem: '+firstItem);
            this._operation = [firstItem,this._lastOperator,this._lastNumber];
           
        }

        console.log('o ultimo foi '+this._lastNumber);

        if (this._operation.length > 3) {

            last = this._operation.pop();
            
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {

            this._lastNumber = this.getResult(false);

        }

        

        let result = this.getResult();

        if (last == '%') {

            result /= 100;
            this._operation = [result];

        } else { 
        
            this._operation = [result];
            if (last) this._operation.push(last);

        }

       
        this.setLastNumberToDisplay();
    }

    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length-1; i >= 0; i--) {           

            if (this.isOperator(this._operation[i]) == isOperator) {

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

        if (!lastNumber) lastNumber = 0;

        this.displayCalc = lastNumber;
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
 
            if (this.isOperator(value)) {

                this.setLastOperation(value);                

            } else {

                this.pushOperation(value)
                this.setLastNumberToDisplay();

            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);

            } else {
                console.log(this._operation);

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }

        }
       
    }

    setError() {

        this.displayCalc = 'Error';
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
                break
            case '=':
                this.calc();
                break;
            case ',':
                this.addDot('.');
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

    addEventListenerAll(element, events, fn) {

        events.split(' ').forEach(event => {

            element.addEventListener(event,fn,false);

        }); 
    }

    initButtonsEvents() {

        let buttons = document.querySelectorAll('.btn');
        buttons.forEach((btn,index) => {

            this.addEventListenerAll(btn, 'click drag',  event => {
                let textBtn = btn.innerHTML;
                this.execBtn(textBtn);
            });
        });

    
    }


    // Encapsulamento - definir as regras de acesso aos atributos do constructor

    // para pegar os dados do atributo

    get displayCalc() {

        return this._displayCalcEl.innerHTML;
    }

    // para manipular os dados do atributo

    set displayCalc(value) {

        if (value.toString().length > 10) {

            this.setError();
        }

        this._displayCalcEl.innerHTML = value;
    }

    
}





(function() {
  var p = {

    getSubmission: function() {
      if ( this.role !== this.Roles.VIEWER ) {
        return;
      }

      if ( typeof this.value == 'undefined' ) {
        this.value = "";
      }

      submisstion = this.value.replace(/[\s]+/g, " ").trim();
      
      return {
        questionId: "",
        timestamp: new Date(),
        submisstion: submisstion
      };
    },


    domReady: function() {
      var $header = this.$.header;
      var $footer = this.$.footer;
      var $testCommand = this.$.evaluate;
      var $codeInput = this.$.code;
      var $asqResult = this.$.result;
      var $resultWrapper = this.$.wrapper;
      var solution= this.sol ? this.sol : "?"; 

      initJsFunctionBody($header.innerHTML, $footer.innerHTML, $testCommand.innerHTML, 
          $codeInput, $asqResult, $resultWrapper, solution);
    } 
  };

  Polymer.mixin2(p, ASQ.ElementTypeMixin);
  Polymer.mixin2(p, ASQ.RoleMixin);
  Polymer.mixin2(p, ASQ.QuestionTypeMixin);
  Polymer('asq-js-function-body', p);
  
})();

function initJsFunctionBody(theHeader, theFooter, theTestCommand, 
  theCodeInput, theAsqResult, theResultWrapper, theSolution) {

  var interval = 150;
  var timer;

  var header = theHeader;
  var footer = theFooter;
  var testCommand = theTestCommand;
  var solution = theSolution;
  
  function getSubmittedCode(){
      var submission = header;
      submission += theCodeInput.innerText;
      submission += footer;
      submission += ';\n' + testCommand;
      
      return submission;
  }

  function evalInput(expr){
      var result;
      try{
          result = eval(expr);
      }catch(err){
          result = err.toString();
      }    
      return JSON.stringify(result, undefined, 2);
  }
  
  function update(){
      var submission = getSubmittedCode();
      var result = evalInput(submission);
      theAsqResult.innerText = result;
      if(result === solution){
          theResultWrapper.classList.add('asq-correct');
      }else{
         theResultWrapper.classList.remove('asq-correct');
      }        
  }
  
  theCodeInput.addEventListener('keypress', function(evt){ 
      var keyCode = evt.keyCode || evt.which; 
      if (keyCode == 9) {
          alert("tono")
         evt.preventDefault();
      }
  });
  
  theCodeInput.addEventListener('input', function(evt){
     clearInterval(timer);
     timer = setTimeout(update, interval);
  }); 
}
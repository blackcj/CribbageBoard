// For an introduction to the Fixed Layout template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232508
(function () {
    "use strict";
    
    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var display = Windows.Graphics.Display;

    app.addEventListener('activated', function(evt) {
        var appState = activation.ApplicationExecutionState;
        if (evt.detail.kind === activation.ActivationKind.launch) {
            if (evt.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // This application has been newly launched. 
                // Initialize your application here.
                pegIndexes = [0, 1, 0, 1, 0, 1];
            } else {
                // This application has been reactivated from suspension.
                // Restore application state here.
                pegIndexes = app.sessionState.pegIndexes;
            }
            evt.setPromise(WinJS.UI.processAll());
        }
  
        if (isLoaded) {
            init();
        } else {
            isReady = true;
        }

        display.DisplayProperties.autoRotationPreferences = display.DisplayOrientations.landscape | display.DisplayOrientations.landscapeFlipped;
        
    });

    // Store user data when app goes into background.
    app.addEventListener('checkpoint', function () {
        //console.log('CHECKPOINT');
        app.sessionState.pegIndexes = pegIndexes;
    });

    app.start();

})();

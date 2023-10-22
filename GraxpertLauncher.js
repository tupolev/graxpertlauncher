#feature-id    Utilities > GraXpert Launcher

#feature-info  Launches GraXpert app for the current view.

#feature-icon  GraxpertLoaderIcon.png

#define VERSION "0.01"

#define TITLE "GraXpertLauncher v" + VERSION


#include <pjsr/Sizer.jsh>          // needed to instantiate the VerticalSizer and HorizontalSizer objects
#include <pjsr/NumericControl.jsh> // needed to instantiate the NumericControl control

let Graxpert = {
   correctionTypes : {
      substraction : 'Substraction',
      division     : 'Division'
   },
   defaultNewFileSuffix: '_GraXpert'
}


let GraxpertLauncherParameters = {
   graxpertExecutablePath: 'C:\\graxpert\\GraXpert-win64.exe',
   imagePath: '',
   targetView: undefined,
   correctionType: Graxpert.correctionTypes.substraction,
   smoothingFactor: 1,

   // stores the current parameters values into the script instance
   save: function() {
      Parameters.set("graxpertExecutablePath", GraxpertLauncherParameters.graxpertExecutablePath)
      Parameters.set("imagePath", GraxpertLauncherParameters.imagePath)
      Parameters.set("correctionType", GraxpertLauncherParameters.correctionType)
      Parameters.set("smoothingFactor", GraxpertLauncherParameters.smoothingFactor)
      Parameters.set("targetView", GraxpertLauncherParameters.targetView)
   },

   // loads the script instance parameters
   load: function() {
      if (Parameters.has("graxpertExecutablePath"))
         GraxpertLauncherParameters.graxpertExecutablePath = Parameters.getString("graxpertExecutablePath")
      if (Parameters.has("imagePath"))
         LchSaturationParameters.imagePath = Parameters.getString("imagePath")
      if (Parameters.has("targetView"))
         LchSaturationParameters.targetView = Parameters.getString("targetView")
      if (Parameters.has("correctionType"))
         LchSaturationParameters.correctionType = Parameters.getString("correctionType")
      if (Parameters.has("smoothingFactor"))
         LchSaturationParameters.smoothingFactor = Parameters.getReal("smoothingFactor")
   }
}

function GraxpertLauncherDialog() {
   this.__base__ = Dialog;
   this.__base__();

   this.userResizable = false;
   this.scaledMinWidth = 500;

   // create a title area
   this.title = new TextBox(this);
   this.title.text = "<b>GraXpert Launcher</b><br><br>This script launches GraXpert app for the selected view";
   this.title.readOnly = true;
   this.title.backroundColor = 0x333333ff;
   this.title.minHeight = 80;
   this.title.maxHeight = 80;

   //executable file path text box
   this.graxpertExecutablePath = new TextBox(this);
   this.graxpertExecutablePath.minHeight = 30;
   this.graxpertExecutablePath.maxHeight = 30;
   this.graxpertExecutablePath.minWidth = 400;
   this.graxpertExecutablePath.maxWidth = 400;
   if (GraxpertLauncherParameters.graxpertExecutablePath != '')
      this.graxpertExecutablePath.text = GraxpertLauncherParameters.graxpertExecutablePath

   //search file dialog
   this.openFileDialog = new OpenFileDialog;
   this.openFileDialog.DisableMultipleSelections = true;
   this.openFileDialog.caption = "Select GraXpert executable file";

   //search file button
   this.graxpertExecutableFileDialogButton = new PushButton(this);
   this.graxpertExecutableFileDialogButton.text = "Search";
   this.graxpertExecutableFileDialogButton.width = 30;
   this.graxpertExecutableFileDialogButton.onClick = () => {
      if (this.openFileDialog.execute() === true)
         this.graxpertExecutablePath.text =  this.openFileDialog.fileName;
   };


   // add a view picker
   this.viewList = new ViewList(this);
   this.viewList.getAll();
   GraxpertLauncherParameters.targetView = this.viewList.currentView;
   this.viewList.onViewSelected = function (view) {
      GraxpertLauncherParameters.targetView = view;
      GraxpertLauncherParameters.imagePath = view.path;
   }


   // add a view picker
   this.correctionTypeList = new ComboBox(this);
   this.correctionTypeList.addItem(Graxpert.correctionTypes.substraction);
   this.correctionTypeList.addItem(Graxpert.correctionTypes.division);
   this.correctionTypeList.currentItem = 0;
   this.correctionTypeList.toolTip = 'Correction type to apply';
   this.correctionTypeList.onItemSelected = function (itemIndex) {
      if (GraxpertLauncherParameters.correctionType != this.itemText(itemIndex)) {
         GraxpertLauncherParameters.correctionType = this.itemText(itemIndex);
      }
   };

   // create the input slider
   this.smoothingFactorControl = new NumericControl(this);
   this.smoothingFactorControl.label.text = "Smoothing factor:";
   this.smoothingFactorControl.label.width = 60;
   this.smoothingFactorControl.setRange(0, 1);
   this.smoothingFactorControl.setPrecision( 1 );
   this.smoothingFactorControl.slider.setRange( 0, 10 );
   this.smoothingFactorControl.toolTip = "<p>Sets the smoothing factor.</p>";
   this.smoothingFactorControl.onValueUpdated = ( value ) => {
      GraxpertLauncherParameters.smoothingFactor = value;
   };

   // prepare the execution button
   this.execButton = new PushButton(this);
   this.execButton.text = "Launch";
   this.execButton.width = 40;
   this.execButton.onClick = () => {
      this.ok();
   };

   // Add create instance button
   this.newInstanceButton = new ToolButton( this );
   this.newInstanceButton.icon = this.scaledResource( ":/process-interface/new-instance.png" );
   this.newInstanceButton.setScaledFixedSize( 24, 24 );
   this.newInstanceButton.toolTip = "New Instance";
   this.newInstanceButton.onMousePress = () => {
      // stores the parameters
      GraxpertLauncherParameters.save();
      // create the script instance
      this.newInstance();
   };


   // create a horizontal slider to layout the execution button
   this.execButtonSizer = new HorizontalSizer;
   this.execButtonSizer.margin = 2;
   this.execButtonSizer.add(this.newInstanceButton)
   this.execButtonSizer.addStretch();
   this.execButtonSizer.add(this.execButton)

   this.graxpertExecutableFilePathDialogSizer = new HorizontalSizer;
   this.graxpertExecutableFilePathDialogSizer.margin = 2;
   this.graxpertExecutableFilePathDialogSizer.add(this.graxpertExecutablePath)
   this.graxpertExecutableFilePathDialogSizer.addStretch();
   this.graxpertExecutableFilePathDialogSizer.add(this.graxpertExecutableFileDialogButton)


   // layout the dialog
   this.sizer = new VerticalSizer;
   this.sizer.margin = 8;
   this.sizer.add(this.title);
   this.sizer.addSpacing(8);
   this.sizer.add(this.graxpertExecutableFilePathDialogSizer);
   this.sizer.addSpacing(8);
   this.sizer.add(this.viewList);
   this.sizer.addSpacing(8);

   this.sizer.add(this.correctionTypeList);
   this.sizer.addSpacing(8);
   this.sizer.add(this.smoothingFactorControl);
   this.sizer.addSpacing(8);
   this.sizer.add(this.execButtonSizer);
   this.sizer.addStretch();
}

function buildGraxpertCommandLine(launchParameters, tempFileName) {
   return launchParameters.graxpertExecutablePath +
            ' ' +
            tempFileName +
            ' -correction ' +
            launchParameters.correctionType +
            ' -smoothing ' +
            launchParameters.smoothingFactor
}

function getSystemSeparator() {
   return corePlatform == "Windows" ? "\\" : "\/";
}

function launchGraxpert(launchParameters) {
   //1 get target view
   let temppath = File.systemTempDirectory
                  + getSystemSeparator()
                  + File.extractName(launchParameters.targetView.window.filePath)
                  + '.temp.fits';

   launchParameters.targetView.window.saveAs(temppath, true, true, true, false, '');


   //2 build command line with cloned target view
   let commandLine = buildGraxpertCommandLine(launchParameters, temppath);

   //3 execute command line
   let process = new ExternalProcess;

   process.onStarted = () => Console.writeln("Launching GraXpert");

   process.onError = (errorCode) => Console.criticalln("GraXpert failed with error code " + errorCode);

   process.onFinished = (code, status) => {
      //4 listen to command ended or new file created
      if (status == 0) {
         //5 open new created file
         Console.noteln("GraXpert process finished successfully");
         //reopen generated file by graxpert in the temp dir
         let graxpertFilePath = File.systemTempDirectory
                  + getSystemSeparator()
                  + File.extractName(launchParameters.targetView.window.filePath)
                  + '.temp'
                  + Graxpert.defaultNewFileSuffix
                  + '.fits';
         let imageWindow = ImageWindow.open(graxpertFilePath);
         if (imageWindow != null) {
            Console.noteln("Loading back image " + graxpertFilePath);
            imageWindow[0].show();
         } else {
           Console.criticalln("Failed to open image " + graxpertFilePath);
         }
      } else {
          Console.criticalln("GraXpert process exited with error code " + exitCode);
      }
   }

   process.start(commandLine);
   for ( ; process.isStarting; )
      processEvents();
   for ( ; process.isRunning; )
      processEvents();
}


GraxpertLauncherDialog.prototype = new Dialog;

function main() {
   Console.writeln("GraXpertLauncher booting up");

   // hide the console, we don't need it
   Console.hide();

   // perform the script on the target view
   if (Parameters.isViewTarget) {
      GraxpertLauncherParameters.load();
      GraxpertLauncherParameters.targetView = Parameters.targetView;
      launchGraxpert(GraxpertLauncherParameters);
      return;
   }

   // is script started from an instance in global context?
   if (Parameters.isGlobalTarget) {
      GraxpertLauncherParameters.load();
   }

   // direct context, create and show the dialog
   let dialog = new GraxpertLauncherDialog;
   let dialogStatus = dialog.execute();

   if (dialogStatus == 1) {
      if (GraxpertLauncherParameters.targetView && GraxpertLauncherParameters.targetView.id) {
         launchGraxpert(GraxpertLauncherParameters);
         Console.writeln("GraXpertLauncher finished");
      } else {
         Console.warningln("No target view is specified ");
      }
   } else {
      Console.writeln("GraXpertLauncher aborted by user");
   }
}

main();

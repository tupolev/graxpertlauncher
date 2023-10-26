#include <pjsr/Sizer.jsh>          // needed to instantiate the VerticalSizer and HorizontalSizer objects
#include <pjsr/NumericControl.jsh> // needed to instantiate the NumericControl control

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
   this.correctionTypeList.addItem(Graxpert.correctionTypes.subtraction);
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
   this.smoothingFactorControl.toolTip = "<p>Smoothing factor to apply.</p>";
   this.smoothingFactorControl.onValueUpdated = ( value ) => {
      GraxpertLauncherParameters.smoothingFactor = value;
   };

   // prepare the execution button
   this.execButton = new PushButton(this);
   this.execButton.text = "Launch";
   this.execButton.width = 40;
   this.execButton.onClick = () => {
      GraxpertLauncherParameters.graxpertExecutablePath = this.graxpertExecutablePath.text;
      GraxpertLauncherParameters.correctionType = this.correctionTypeList.itemText(this.correctionTypeList.currentItem);
      GraxpertLauncherParameters.smoothingFactor = this.smoothingFactorControl.value;
      GraxpertLauncherParameters.save();
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

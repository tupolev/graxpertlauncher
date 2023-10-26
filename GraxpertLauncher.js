#feature-id    GraXpertLauncher : Utilities > GraXpertLauncher

#feature-info  Launches GraXpert app for the current view.

#feature-icon  GraxpertLauncherIcon.png

#define VERSION "0.1"

#define TITLE "GraXpertLauncher Script"

#define SCRIPTNAME "GraXpertLauncher"

function main() {
   Console.writeln(SCRIPTNAME + " booting up");

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
   GraxpertLauncherDialog.prototype = new Dialog;
   let dialog = new GraxpertLauncherDialog;
   let dialogStatus = dialog.execute();

   if (dialogStatus == 1) {
      if (GraxpertLauncherParameters.targetView && GraxpertLauncherParameters.targetView.id) {
         launchGraxpert(GraxpertLauncherParameters);
         Console.writeln(SCRIPTNAME + " finished");
      } else {
         Console.warningln("No target view is specified ");
      }
   } else {
      Console.writeln(SCRIPTNAME + " aborted by user");
   }
}

main();

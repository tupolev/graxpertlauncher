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

   process.onStarted = () => Console.writeln("Launching GraXpert with command \n" + commandLine);

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
            Console.writeln("Removing temporary image " + temppath);
            File.remove(temppath);
            Console.writeln("Removed temporary image " + temppath);

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

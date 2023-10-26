let Graxpert = {
   correctionTypes : {
      subtraction : 'Subtraction',
      division     : 'Division'
   },
   defaultNewFileSuffix: '_GraXpert'
}

let GraxpertLauncherParameters = {
   graxpertExecutablePath: 'C:\\graxpert\\GraXpert-win64.exe',
   imagePath: '',
   targetView: undefined,
   correctionType: Graxpert.correctionTypes.subtraction,
   smoothingFactor: 0,

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
         GraxpertLauncherParameters.imagePath = Parameters.getString("imagePath")
      if (Parameters.has("targetView"))
         GraxpertLauncherParameters.targetView = Parameters.getString("targetView")
      if (Parameters.has("correctionType"))
         GraxpertLauncherParameters.correctionType = Parameters.getString("correctionType")
      if (Parameters.has("smoothingFactor"))
         GraxpertLauncherParameters.smoothingFactor = Parameters.getReal("smoothingFactor")
   }
}

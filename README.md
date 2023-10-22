# graxpertlauncher
GraXpertLauncher is a Pixinsight feature script which fits GraXpert gradient removal tool within the usual PixInsight process workflow.

##Installation:
1. Install [GraXpert](https://www.graxpert.com/) and write down the installation path.
2. Clone this repository into the src/scripts folder in your PixInsight installation path.
3. Open PixInsitht and go to Scripts > Feature Scripts. Click "Add" and select the file GraxpertLauncher.js from your src/scripts/GraxpertLauncher folder.
4. Click "regenerate" and "Done" to close the window.

##Usage:
1. Go to Scripts > Utilities > GraXpertLauncher.
2. Click "Search" and select the GraXpert executable file from its installation folder.
3. Select the view to apply GraXpert process.
4. Select the correction type: Substraction or Division, as in the DBE/ABE standard Pixinsight processes.
5. Select the smoothing factor between 0..1.
6. Click "Launch" or drag the triangle icon into the desired view.
7. GraXpertLauncher will call GraXpert with those parameters. When GraXpert finishes, the resulting image will be loaded back into Pixinsight workspace.

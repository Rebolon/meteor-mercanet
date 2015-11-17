## Installation

copy/paste settins.dist.json to settings.json
fill it with "fake" string on each row value
run meteor --settings settings.json
stop server
do a meteor add-platform android (accept all)
then build with meteor build /pathToYourBuildFolder --server http://YourServer:port --mobile-settings settings.json

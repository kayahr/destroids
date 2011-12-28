<?php require("../../target/demo/resolver.php")?>
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />    
    <title>Destroids</title>
    <link href="../main/resources/stylesheets/destroids.css" media="screen" rel="stylesheet" type="text/css" />
    <?php $resolver->includeScript("destroids/Game.js")?>
    <script type="text/javascript">
    /* <![CDATA[ */
     
    destroids.imagesDir = "../main/resources/images";
    destroids.onPreferences = function() { alert("Not implemented") };
    destroids.onHelp = function() { alert("Not implemented") };
    //destroids.scoreSubmitUrl = "http://localhost/~k/projects/php/scority/index.php/submit/destroids";
    //destroids.scoreTop5Url = "http://localhost/~k/projects/php/scority/index.php/top5/destroids";
    
    game = new destroids.Game("output");

    function switchOrientation()
    {
        var e, tmp;
        
        e = document.getElementById("output");
        tmp = e.style.width;
        e.style.width = e.style.height;
        e.style.height = tmp;
        game.resize();
    }
    
    /* ]]> */
    </script>    
  </head>
  <body style="margin:0;padding:0;border:0">  
    <div id="output" style="width:320px;height:400px;background:#ccc;overflow:hidden"></div>
    <div>
      <br />
      <button onclick="game.start()">Start</button>
      <button onclick="game.stop()">Stop</button>
      <button onclick="switchOrientation()">Switch orientation</button>
    </div>
  </body>
</html>

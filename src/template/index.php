<?php
  require_once 'server/MobileDetect.php';
  $detect = new Mobile_Detect;
?>

<!DOCTYPE html>

<html lang="en">

  <head>
    <title>Célia LOPEZ - Interactive & 3D designer</title>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="description" content="Freelance worldwide interactive & 3D designer">
    <meta name="copyright" content="© Copyright 2018 - Célia Lopez">

    <base href="/" >

    <!-- Favicon -->

    <!-- Facebook meta -->
    <meta property="og:title" content="Célia LOPEZ - Interactive & 3D designer"/>
    <meta property="og:image" content="http://www.celialopez.fr/images/share/facebook.jpg"/>
    <meta property="og:url" content="http://www.celialopez.fr"/>
    <meta property="og:site_name" content="Célia LOPEZ"/>
    <meta property="og:description" content="Worldwide freelance interactive & 3D designer"/>

    <!-- Twitter meta -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@CliaLpz">
    <meta name="twitter:creator" content="@CliaLpz">
    <meta name="twitter:title" content="Célia LOPEZ - Interactive & 3D designer">
    <meta name="twitter:description" content="Worldwide freelance interactive & 3D designer">
    <meta name="twitter:image" content="http://www.celialopez.fr/images/share/twitter.jpg">
    <meta name="twitter:image:src" content="http://www.celialopez.fr/images/share/twitter.jpg">

    <!-- GOOGLE + Share -->
    <meta itemprop="name" content="Célia LOPEZ - Interactive & 3D designer">
    <meta itemprop="description" content="Worldwide freelance interactive & 3D designer ">
    <meta itemprop="image" content="http://www.celialopez.fr/images/share/facebook.jpg">

    <!-- Robots -->
    <meta name="robots" content="index, follow">

    <!-- Favicons -->
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <?php if ($detect->isMobile() && !$detect->isTablet()) { ?>
    <link href="<%= htmlWebpackPlugin.files.chunks.mobile.css %>" rel="stylesheet"></head>
    <?php } else { ?>
    <link href="<%= htmlWebpackPlugin.files.chunks.desktop.css %>" rel="stylesheet"></head>
    <?php } ?>

  </head>

  <body>

    <div id="application">

    </div>

    <?php if ($detect->isMobile() && !$detect->isTablet()) { ?>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks.mobile.entry %>"></script>
    <?php } else { ?>
    <script type="text/javascript" src="<%= htmlWebpackPlugin.files.chunks.desktop.entry %>"></script>
    <?php } ?>

  </body>

</html>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Template1</title>
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
  <!-- Custom CSS -->
  <style>
    body {
      background-color: #f8f9fa;
    }
    .carousel-item {
      height: 100vh;
      min-height: 350px;
      background: no-repeat center center scroll;
      background-size: cover;
    }
    .carousel-caption {
      bottom: 165px;
    }
    .btn-primary:hover, .btn-primary:focus {
      background-color: #002752 !important;
      border-color: #002752 !important;
    }
  </style>
</head>
<body>
  <!-- Image Slider -->
  <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
    <div class="carousel-inner">
      <?php
        $dir = "images/";
        $images = glob($dir . "*.png");
        foreach($images as $image):
            // var_dump($image);
      ?>
      <div class="carousel-item <?php if($image === $images[0]) echo 'active'; ?>" style="background-image: url('<?php echo $image; ?>')">
        <div class="carousel-caption">
          <h5>Image Title</h5>
          <p>Image Description</p>
        </div>
      </div>
      <?php endforeach; ?>
    </div>
    <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>
  <!-- Bootstrap JS -->
  <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
  <!-- Custom JS -->
  <script>
    $(document).ready(function() {
      $('#carouselExampleControls').carousel({
        interval: 3000
      })
    });
  </script>
</body>
</html>

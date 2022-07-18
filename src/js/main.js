
$(function () {

  var $image = $('#image');
  var $download1 = $('#download1');
  var $download2 = $('#download2');
  var $dataHeight = $('#dataHeight');
  var $dataWidth = $('#dataWidth');
  var $dataRotate = $('#dataRotate');
  var $dataScaleX = $('#dataScaleX');
  var $dataScaleY = $('#dataScaleY');
  var $imageUpload = $("#imageUpload")
  var $sliderItem = $('.slider_item')
  var $showSlide = $('.slider_wrapper button')
  var options = {
    preview: '.img-preview',
    autoCropArea: 1,
    crop: function (e) {
      $dataHeight.val(Math.round(e.height));
      $dataWidth.val(Math.round(e.width));
      $dataRotate.val(e.rotate);
      $dataScaleX.val(e.scaleX);
      $dataScaleY.val(e.scaleY);
    },
  };

  class Cropper {
    constructor($image) {
      this.image = $image
      this.options = options
      this.$dataTooltip = $('[data-toggle="tooltip"]')
      this.$docsData = $('.docs-data')
      this.$docsButtons = $('.docs-buttons')
      this.$docsToggles = $('.docs-toggles')
      this.init()
      this.destroy()
      this.tooltip()
      this.buttons_methods_click()
      this.buttons_methods_change()
      this.keydown_method_click()
      this.buttons_methods_oninput()
      this.slider_methods()

    }
    init() {
      return this.image.cropper(this.options)
    }
    destroy() {
      return this.image.cropper('destroy')
    }
    tooltip() {
      return this.$dataTooltip.tooltip()
    }
    buttons_methods_change() {
     this.$docsToggles.on('change', 'input', function () {
        var $this = $(this);
        var name = $this.attr('name');
        var type = $this.prop('type');
        var cropBoxData;
        var canvasData;

        if (!$image.data('cropper')) {
          return;
        }

        if (type === 'checkbox') {
          options[name] = $this.prop('checked');
          cropBoxData = $image.cropper('getCropBoxData');
          canvasData = $image.cropper('getCanvasData');

          options.built = function () {
            $image.cropper('setCropBoxData', cropBoxData);
            $image.cropper('setCanvasData', canvasData);
          };
        } else if (type === 'radio') {
          options[name] = $this.val();
        }

        $image.cropper('destroy').cropper(options);
      });
    }
    buttons_methods_click() {
      this.$docsButtons.on('click', '[data-method]', function () {
        var $this = $(this);
        var data = $this.data();
        var $target;
        var result;

        if ($this.prop('disabled') || $this.hasClass('disabled')) {
          return;
        }

        if ($image.data('cropper') && data.method) {
          data = $.extend({}, data);

          if (typeof data.target !== 'undefined') {
            $target = $(data.target);

            if (typeof data.option === 'undefined') {
              try {
                data.option = JSON.parse($target.val());
              } catch (e) {
                console.log(e.message);
              }
            }
          }

          if (data.method === 'rotate') {
            $image.cropper('clear');
          }

          result = $image.cropper(data.method, data.option, data.secondOption,);

          if (data.method === 'rotate') {
            $image.cropper('crop');
          }

          switch (data.method) {
            case 'scaleX':
            case 'scaleY':
              $(this).data('option', -data.option);
              break;

            case 'getCroppedCanvas':
              if (result) {
                $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

                if (!$download1.hasClass('disabled')) {
                  $download1.attr('href', result.toDataURL('image/jpeg', 1))
                }
                if (!$download2.hasClass('disabled')) {
                  $download2.attr('href', result.toDataURL('image/png', 1));
                }

              }

              break;
          }

          if ($.isPlainObject(result) && $target) {
            try {
              $target.val(JSON.stringify(result));
            } catch (e) {
              console.log(e.message);
            }
          }

        }
      });
    }
    keydown_method_click() {
      $(document.body).on('keydown', function (e) {

        if (!$image.data('cropper') || this.scrollTop > 300) {
          return;
        }

        switch (e.which) {
          case 37:
            e.preventDefault();
            $image.cropper('move', -1, 0);
            break;

          case 38:
            e.preventDefault();
            $image.cropper('move', 0, -1);
            break;

          case 39:
            $image.cropper('move', 1, 0);
            break;

          case 40:
            e.preventDefault();
            $image.cropper('move', 0, 1);
            break;
        }
      });
    }
    buttons_methods_oninput() {
      this.$docsData.on('input', event => {
        if (event.target !== img_w && event.target !== img_h) {
          return
        }
        $('.btn_js_pic div').html(`<button id="btnSize" type="button" class="btn btn-primary" data-method="getCroppedCanvas"
        data-option="{&quot;width&quot;: ${img_w.value}, &quot;height&quot;: ${img_h.value} }" >
            <span class="docs-tooltip" data-toggle="tooltip" title="">
            <span class= "resres" id="res_w">${img_w.value}</span> x
            <span class= "resres" id="res_h">${img_h.value}</span>
            </span>
          </button>
          `)
      })
    }
    slider_methods() {
      $('.slider_wrapper').on('click', function (e) {
        if (e.target.dataset.method == 'cinema') {
          $sliderItem.toggleClass('hid')
          $showSlide.html('Слайд')
        }
      })
    }
  }
  $("#myCarousel").carousel({
    interval : false
  });



  var init_cropper = new Cropper($image)

  function readURL(e) {
    if (this.files && this.files[0]) {
      var reader = new FileReader();
      $(reader).on('load', function (e) { $image.attr('src', e.target.result); });
      reader.readAsDataURL(this.files[0]);
      reader.onloadend = (function () {
        init_cropper.destroy()
        init_cropper.init()
      });
    }
  }
  $imageUpload.on('change', readURL);
});

// let counter = 1;

// function increaseCounter(value) {
//   counter = value + 1;
// }

// increaseCounter(counter);

// console.log(counter); // 2
// increaseCounter(counter);
// increaseCounter(counter);
// increaseCounter(counter);
// increaseCounter(counter);
// increaseCounter(counter);
// increaseCounter(counter);

// console.log(counter);
let counter = 1;

function increaseCounter(value) {
  return value + 1;
}

console.log(increaseCounter(counter)); // 2
console.log(increaseCounter(counter)); // 2
console.log(increaseCounter(counter)); // 2

console.log(counter); // 1






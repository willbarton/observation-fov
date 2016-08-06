// Simple mapping of sensor size name to [width,height]
var sensor_sizes = {
    'APS-C': [23.6, 15.7],
    'APS-C Canon': [22.2, 14.8],
    'Full Frame': [36.0, 24.0],
    'Four Thirds': [17.3,13],
    '1 inch': [13.2,8.8],
    'other': [NaN, NaN]
}

// Update the fov field
function update_fov() {
    // Get the focal length. If it isn't entered, bail because we
    // can't do anything without it.
    var focal_length = parseFloat($('#focal-length').val());
    if (Number.isNaN(focal_length == NaN)) {
        return;
    }

    // Get the focal reducer multiplier
    var focal_reducer = parseFloat($('#focal-reducer').val());
    if (!Number.isNaN(focal_length)) {
        focal_length = focal_length * focal_reducer;
    }

    // Get the sensor size. If the text fields aren't used, just use
    // the drop-down value.
    var sensor_size = $('#sensor-size').val();

    var sensor_width = parseFloat($('#sensor-width').val());
    if (Number.isNaN(sensor_width)) {
        console.log(sensor_sizes[sensor_size][0]);
        sensor_width = sensor_sizes[sensor_size][0];
    }

    var sensor_height = parseFloat($('#sensor-height').val());
    if (Number.isNaN(sensor_height)) {
        console.log(sensor_sizes[sensor_size][1]);
        sensor_height = sensor_sizes[sensor_size][1];
    }

    if (Number.isNaN(sensor_width) || Number.isNaN(sensor_height)) {
        return;
    }

    // Get FOV
    var fov_width = (sensor_width / focal_length)
    var fov_height = (sensor_height / focal_length)

    // 3438 converts to arc minutes (arc minutes per radian)
    var fov_width_arc = fov_width * 3438;
    var fov_height_arc = fov_height * 3438;

    var fov_width_deg = fov_width * (180/Math.PI);
    var fov_height_deg = fov_height * (180/Math.PI);
    console.log("Degrees", fov_width_deg, fov_height_deg)

    // Update FOV value
    $('#fov').val(fov_width_arc.toFixed(1) + "' x " + fov_height_arc.toFixed(1) + "'");

    draw_frame(fov_width_deg, fov_height_deg);
}    

function draw_frame(fov_width_deg, fov_height_deg) {
    var  preview_coverage = $('#preview-image').attr('data-coverage');

    // Draw frame over preview image
    var image_size = $('#preview-image').width();
    var frame_width = fov_width_deg * (image_size / preview_coverage)
    var frame_height = fov_height_deg * (image_size / preview_coverage)
    var frame_top = (image_size/2) - (frame_height / 2);
    var frame_left = (image_size/2) - (frame_width / 2);

    $('#frame-overlay').css('width', frame_width);
    $('#frame-overlay').css('height', frame_height);
    $('#frame-overlay').css('top', frame_top);
    $('#frame-overlay').css('left', frame_left);
}

function update_preview(e) {
    var preview_custom = $('#preview-custom').val();
    if (preview_custom != '') {
        console.log("Getting", preview_custom);
        var custom_encoded = encodeURIComponent(preview_custom);
        preview_image = 'http://skyview.gsfc.nasa.gov/cgi-bin/images?Position=' + custom_encoded + '&Survey=DSS&Coordinates=J2000&pixels=600&size=4&Return=JPG'

        // Provide some feedback for custom image loads
        $('#preview-loading').css('display', 'block');
        $('#preview-image').load(function() {
            $('#preview-loading').css('display', 'none');
        });
    }

    $('#preview-image').attr('src', preview_image);
    $('#preview-image').attr('data-coverage', '4');
}

function toggle_width_height() {
    console.log("toggling width and height")
    var sensor_size = $('#sensor-size').val();
    console.log(sensor_size)
    if (sensor_size == "other") {
        $('#sensor-width').show();
        $('#sensor-height').show();
    } else {
        $('#sensor-width').val('');
        $('#sensor-height').val('');
        $('#sensor-width').hide();
        $('#sensor-height').hide();
        update_fov();
    }
}

$(document).ready(function() {
    // If sensor-size is changed, and it's "other", show the
    // width/height fields
    // $('#sensor-size').change(update_fov);
    $('#sensor-size').change(toggle_width_height);
    $('#sensor-width').change(update_fov);
    $('#sensor-height').change(update_fov);
    $('#focal-length').change(update_fov);
    $('#focal-reducer').change(update_fov);

    // $('#preview').change(function() {
    //     $('#preview-custom').val('')
    //     update_preview();
    // });
    $('#preview-custom').change(update_preview);
});


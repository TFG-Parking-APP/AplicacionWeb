'use strict'

const myModalAlternative = new bootstrap.Modal("#myModal");

$("#payBtn").on("click", function() {
    console.log(myModalAlternative);
    $("#spn").css('display', '');
    console.log($("#carId").val());
    $.ajax({
        method: "GET",
        url: "/datosPago",
        data: {
            carId: $("#carId").val()
        },
        // En caso de éxito, mostrar el resultado
        // en el documento HTML
        success: function(data, textStatus, jqXHR) {
            console.log(textStatus);
            $("#resultado").text("El resultado es " + data.resultado);
            $("#spn").css('display', 'none');
            $("#infoPago").text(data.resultado);
            $("#infoTiempo").text(data.tiempoEstacionado);
            $("#price").val(data.resultado.replace(' €', ''));
            myModalAlternative.show();
        },
        // En caso de error, mostrar el error producido
        error: function(jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
});
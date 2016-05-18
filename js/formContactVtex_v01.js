/*
- ------------------------------------------------------------
- F O R M C O N T A C T V T E X - V.0.1 ----------------------
- ------------------------------------------------------------
- : INFO : ---------------------------------------------------
- Formulário de contato para usuários vtex -------------------
- Trabalha com validações em campos e a criação de máscaras --
- ------------------------------------------------------------
- Created 18/05/2016 -----------------------------------------
- ------------------------------------------------------------
- : REQUIRES : -----------------------------------------------
- jQuery any version -----------------------------------------
- jquery.mask.js ---------------------------------------------
- ------------------------------------------------------------
- : NOTE : ---------------------------------------------------
- Caso não tenha o atribute data a mensagem será do seu label
- [data-alert or label] --------------------------------------
- ------------------------------------------------------------
- : LICENSE : ------------------------------------------------
- Free Cultural Works, Libre Niced! --------------------------
- http://creativecommons.org/freeworks -----------------------
- ------------------------------------------------------------
- : COURTESY : -----------------------------------------------
- [Equip. developers] ----------------------------------------
- [TOPDEALS - Negócios e Ideias] -----------------------------
- http://topdeals.com.br -------------------------------------
- ------------------------------------------------------------
- : POWERED : ------------------------------------------------
- WIZARD - FLY -----------------------------------------------
- Adonis Vieira ----------------------------------------------
- http://wizardfly.com.br ------------------------------------
- I T I S T H E G R E A T E W I Z A R D W H O F L I E S ------
- ------------------------------------------------------------
*/

var Wform = Wform || {};

(function ($) {
    'use strict';

    var
        Wvar = {
            // VTEX
            storeName       : '',
            dataEntity      : 'CO',

            // FORM
            sendButton      : '.sendContactVtex',
            formSubmited    : '',
            idStoreName     : '#master_data_store_name',
            idDataEntity    : '#master_data_data_entity',

            // INFO
            contactPhone    : '<p>Telefones: (00) 0000-0000 ou 0800 000 0000<p> ',
            contactEmail    : '<p>Emails: sac@loja.com ou contato@loja.com.br<p>',

            // BOX INFO
            contentAlert    : '#contentAlert',
            alert           : '',

            // REDIRECT
            urlRedirect     : '/success',

            // MASK
            cpf             : '.cpfMask',
            cep             : '.cepMask',
            date            : '.dateMask',
            tel             : '.telMask',
            phone           : '.phoneMask',
            number          : '.numberMask',
            nTwo            : '.numberTwoMask',
            nThree          : '.numberThreeMask',
            nFour           : '.numberFourMask',
            cnpj            : '.cnpjMask',
            money           : '.moneyMask',
            timeMask        : '.timeMask',
            numberBeh       : '.numberBeh',
            spOptions       : {
                onKeyPress: function(val, e, field, options) {
                    field.mask(Wform.SPMaskBehavior.apply({}, arguments), options);
                }
            }
        };

    Wform.Init = function () {
        Wform.Listen();
        Wform.Mask();

        console.log('Init: jsnomeLoja', jsnomeLoja);
        console.log('Init: typeof', typeof(jsnomeLoja));
    };

    Wform.Listen = function () {
        $(Wvar.sendButton).on('click', Wform.ValForm);
    };

    Wform.SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    };

    Wform.Mask = function () {
        // $(Wvar.date).mask('00/00/0000');
        // $(Wvar.cep).mask('00000-000');
        // $(Wvar.nTwo).mask('00');
        // $(Wvar.nThree).mask('000');
        // $(Wvar.nFour).mask('0000');
        // $(Wvar.number).mask('0000000000000000');
        // $(Wvar.cpf).mask('000.000.000-00');
        // $(Wvar.tel).mask('(00) 0000-0000');
        // $(Wvar.cnpj).mask('00.000.000/0000-00');
        // $(Wvar.money).mask("#.##0,00", {reverse: true});
        // $(Wvar.timeMask).mask('00:00:00');
        // $(Wvar.numberBeh).mask('000.0', {reverse: true});
        $(Wvar.phone).mask(Wform.SPMaskBehavior, Wvar.spOptions);
    };

    Wform.ValForm = function (e) {
        var
            target      = e.target,
            form        = $(target).attr('data-form'),
            error       = false,
            regEmail    = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            message     = '',
            lbl;

        Wvar.alert = '<strong>Atenção: Verifique os seguintes campos</strong>';
        $(Wvar.contentAlert).fadeOut(350);
        $(Wvar.contentAlert).html('');

        if ($(target).prop('disabled') === false) {
            $(form + ' input[type="text"], ' + form + ' select,' + form + ' textarea').each(function () {

                // required
                if ($(this).attr('data-required') === 'true') {
                    lbl = $(this).parent().find('label');

                    if ($(this).val() === '') {

                        $(this).addClass('error');
                        $(lbl).addClass('error');

                        if ($(this).attr('data-alert') && $(this).attr('data-alert') !== '') {
                            message = $(this).attr('data-alert');

                        } else {
                            message = $(this).parent().find('label').text().replace('*', '');
                        }

                        Wvar.alert += '<p>' + message + '</p>';
                        error = true;

                    } else {
                        $(this).removeClass('error');
                        $(lbl).removeClass('error');
                    }
                }

                // email
                if ($(this).hasClass('valEmail')) {
                    lbl = $(this).parent().find('label');

                    if (!regEmail.test($(this).val())) {
                        $(this).addClass('error');
                        $(lbl).addClass('error');

                        Wvar.alert += '<p>Email inválido!</p>';
                        error = true;

                    } else {
                        $(this).removeClass('error');
                        $(lbl).removeClass('error');
                    }
                }
            });
        }

        // checkbox validate - terms
        /*if (!$(Wvar.terms).is(':checked')) {
            $(Wvar.checkTerms).addClass('error');
            Wvar.alert += '<p>Você deve aceitar os termos de uso!</p>';
            error = true;
        } else {
            $(Wvar.checkTerms).removeClass('error');
        }*/

        if (error) {
            $(Wvar.contentAlert).html(Wvar.alert);
            $(Wvar.contentAlert).fadeIn(650);

            $(Wvar.sendContactVtex).prop('disabled', false);

            return false;
        }

        $(Wvar.sendContactVtex).prop('disabled', true);

        // create loading
        $(Wvar.contentAlert).fadeIn(350);
        Wvar.alert = '';
        Wvar.alert += '<p>AGUARDE</p>';
        Wvar.alert += '<img src="img/loader.gif" alt="loader" />';
        $(Wvar.contentAlert).html(Wvar.alert);

        Wform.FormCreate(target);

        return false;
    };

    Wform.FormCreate = function (target) {
        // check variable - VTEX return
        if (typeof(jsnomeLoja) !== 'undefined') {
            console.log('HAS VAR');
            Wvar.storeName = jsnomeLoja;
            Wform.ClientCreate();

        } else {
            console.log('Hey DEVELOPER: Verifique se a VTEX esta retornando a variavel jsnomeLoja - (not have jsnomeLoja)');
            $(Wvar.sendContactVtex).prop('disabled', false);

            Wform.GenericMessage();

            return false;
        }
    };

    Wform.ClientCreate = function () {
        console.log('ClientCreate');

        var
            obj = {
                'firstName' : $('#cl_first_name').val(),
                'lastName'  : $('#cl_last_name').val(),
                'email'     : $('#cl_email').val(),
                'homePhone' : $('#cl_home_phone').val(),
                'phone'     : $('#cl_phone').val()
            },
            url = "http://api.vtexcrm.com.br/" + Wvar.storeName + "/dataentities/CL/documents/";

        console.log('ClientCreate');
        console.log('ClientCreate - obj', obj);
        console.log('ClientCreate - url', url);

        $.ajax({
            headers : {
                'Accept'        : 'application/vnd.vtex.ds.v10+json',
                'Content-Type'  : 'application/json'
            },
            data    : JSON.stringify(obj),
            type    : 'PATCH',
            url     : url,
            success : function(data){
                console.log('success - ClientCreate data', data);
                Wform.ContactCreateByEmail($('#cl_email').val());
            },
            error   : function(data){
                console.log('error - ClientCreate', data);
                Wform.GenericMessage();
            }
        });
    };

    Wform.ContactCreate = function (co_client) {
        var
            obj = {
                'client'        : co_client.replace('CL-', ''),
                'description'   : $("#co_description").val(),
                'type'          : $("#co_type").val()
            },
            url = "http://api.vtexcrm.com.br/" + Wvar.storeName + "/dataentities/" + Wvar.dataEntity + "/documents/";

        $.ajax({
            headers: {
                'Accept'        : 'application/vnd.vtex.ds.v10+json',
                'Content-Type'  : 'application/json'
            },
            data    : JSON.stringify(obj),
            type    : 'PATCH',
            url     : url,
            success : function(data){
                console.log('success - ClientCreate data', data);
                window.location.href = Wvar.urlRedirect;
            },
            error   : function(data){
                console.log('error - ClientCreate data', data);
                Wform.GenericMessage();
            }
        });
    };

    Wform.ContactCreateByEmail = function (cl_email) {
        var
            url = "http://api.vtexcrm.com.br/" + Wvar.storeName + "/dataentities/CL/search/?email=" + cl_email + "&_fields=id";

        $.ajax({
            headers: {
                'Accept'        : 'application/vnd.vtex.ds.v10+json',
                'Content-Type'  : 'application/json'
            },
            type    : 'GET',
            url     : url,
            success : function (data) {
                console.log('success - ContactCreateByEmail data', data);
                Wform.ContactCreate(data[0].id);
            },
            error   : function (data) {
                Wform.GenericMessage();
                console.log('error - ContactCreateByEmail data', data);
            }
        });
    };

    Wform.GenericMessage = function () {
        $(Wvar.contentAlert).fadeIn(350);

        Wvar.alert = '';
        Wvar.alert += '<p>Olá cliente</p>';
        Wvar.alert += '<p>Infelizmente ocorreu um erro, tente novamente.</p>';
        Wvar.alert += '<p>Se o erro persistir, por favor entre em contato com algum dos recursos abaixo</p>';
        Wvar.alert += Wvar.contactPhone;
        Wvar.alert += Wvar.contactEmail;

        $(Wvar.contentAlert).html(Wvar.alert);

        $(Wvar.sendContactVtex).prop('disabled', false);
    };

    $(document).ready(function () {
        Wform.Init();
    });

}(jQuery));
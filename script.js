(function ($) {
    $('input[type="range"]').slider();
    $('.slider__list li').click(function () {
        let index = $(this).index();
        $('.slider__slide').removeClass('slider__slide-active');
        $('.slider__slide').eq(index).addClass('slider__slide-active');

        $('.slider__list li').removeClass('slider__item-active');
        $(this).addClass('slider__item-active');
    })

    if($('.price__old').length){
        let price_old = parseFloat($('.price__old').data('price_old'));
        let price_current = parseFloat($('.price__current').data('price_current'));
        // console.log(price__old);
        // console.log(price__current);
        let delta = price_old - price_current;
        let discont = Math.round(price_current/price_old*100);
        let deltaHTML = `<div class="price__delta">
        <div class="value_wrapper">
            <span class="value">${delta.toString().replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g,"\$1 ")} <span class="rub">Р</span></span>
            <span class="suffix">экономии</span>
            </div>
            <div class="price__discont">-${discont}%</div>
        </div>`;
        $('.price__current').after(deltaHTML);
    }

    $('.art__value').click(function (e) {
        let artel = $('.art__value_hidden');
        artel.select();
        let art = artel.val();
        document.execCommand("copy");
        $('.art').prepend(`<div class="art__success">Артикул ${art} скопирован</div>`)
        setTimeout(()=>{
            $('.art__success').remove();
        }, 1500)
    })
    $('.product-size__item:not(.product-size__item-disable)').click(function () {
        $('.product-size__item-active').removeClass('product-size__item-active');
        $(this).addClass('product-size__item-active');
        product.size = $(this).text().trim();
    })
    $('.add_to_cart__count_btn').click(function () {
        let countInput = $('.add_to_cart__count_value');
        let countInputVal = countInput.val();
        let countInputMin= countInput.attr('min');
        let countInputMax= countInput.attr('max');

        $('.add_to_cart__count_error').remove();
        if($(this).hasClass('add_to_cart__count_btn-plus')){
            if(countInputVal+1<countInputMax){
                countInput.val(++countInputVal)
            }else {
                if(!$('.add_to_cart__count_error').length){
                    setErrrorCount('max',countInputMax)
                }
            }
        }else{
            if(countInputVal>countInputMin){
                countInput.val(--countInputVal)
            }else {
                if(!$('.add_to_cart__count_error').length){
                    setErrrorCount('min',countInputMin)
                }
            }
        }
        product.count = countInputVal;
    });
    $('.add_to_cart__count_value').keyup(function () {
        let countInputVal =  parseInt($(this).val());
        let countInputMin =  parseInt($(this).attr('min'));
        let countInputMax =  parseInt($(this).attr('max'));
        product.count = countInputVal;
        if(countInputVal>countInputMax){
            setErrrorCount('max',countInputMax)

        }else if(countInputVal<countInputMin){
            setErrrorCount('min',countInputMin)
        }
    })
    function setErrrorCount(type,value){
        if(type == 'min'){
            $('.add_to_cart__count').append(`<div class="add_to_cart__count_error">Минимум ${value}</div>`)
            setTimeout(function () {
                $('.add_to_cart__count_error').remove()
            }, 1000)
        }else if(type == 'max'){
            $('.add_to_cart__count').append(`<div class="add_to_cart__count_error">Максимум ${value}</div>`)
            setTimeout(function () {
                $('.add_to_cart__count_error').remove()
            }, 1000)
        }
        product.count = value;
        $('.add_to_cart__count_value').val(value);
    }
    $('.tabs__link').click(function () {
        let href = $(this).attr('href').substr(1);
        $('.tabs__link').removeClass('tabs__link-active');
        $(this).addClass('tabs__link-active');
        $(`.tabs__content_item`).removeClass('tabs__content_item-open');
        $(`.tabs__content_item[name="${href}"]`).addClass('tabs__content_item-open');
    })
    $('input[type="tel"]').mask("+7(999) 999-99-99",{autoclear: false});
    $('.slider__photo_inner').magnificPopup({
        delegate: 'a',
        type: 'image',
        closeOnContentClick: false,
        closeBtnInside: false,
        mainClass: 'mfp-with-zoom mfp-img-mobile',
        image: {
            verticalFit: true,
        },
        gallery: {
            enabled: true
        },
        zoom: {
            enabled: true,
            duration: 300, // don't foget to change the duration also in CSS
            opener: function(element) {
                return element.find('img');
            }
        },
        callbacks: {
            change: function(el) {
                $('.slider__slide').removeClass('slider__slide-active');
                $('.slider__slide').eq(el.index).addClass('slider__slide-active');

                $('.slider__list li').removeClass('slider__item-active');
                $('.slider__list li').eq(el.index).addClass('slider__item-active');
            },
        }
    });
    $('button.add_to_cart__btn').click(function () {
        if(!$(this).hasClass('btn-cart-success')){
            $.ajax({
                url: 'https://reqres.in/api/users',
                type: "POST",
                data: product,
                success: ()=>{
                    $(this).addClass('btn-cart-success').text('В корзине');
                    console.log(product)
                }
            });
        }
    })
    $('.fast_order').submit(function (e) {
        e.preventDefault();
        let str = $(this).find('input').val().replace(/D/g, '');
        product.tel = str.replace(/\D+/g,"");


        if(product.tel.length != 11){
            alert('Телефон имеет неверный формат');
        }else{
            $.ajax({
                url: 'https://reqres.in/api/users',
                type: "POST",
                data: product,
                success: () => {
                    console.log(product);
                    alert('Заказ отправлен')
                }
            });
        }
    })
    $('.product-size__change_size').magnificPopup({
        type: 'inline',

        fixedContentPos: false,
        fixedBgPos: true,

        overflowY: 'auto',

        closeBtnInside: true,
        preloader: false,

        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in'
    });
    $('.product-size__form_item .ui-slider-input').change(function () {
        $(this).closest('.product-size__form_item').find('input[type="number"]').val($(this).val());
        setsize()
    })
    $('.product-size__form_item input[type="number"]').keyup(function () {
        $(this).closest('.product-size__form_item').find('.ui-slider-input').val($(this).val()).slider("refresh");
        setsize()
    })
    function setsize() {
        let height = $('#height').val();
        let weight = $('#weight').val();
        let index = height*weight;
        if(index <= 9900){
            $('.product-size__result').text('S');
            product.size = 's'
        }else if(index > 9900 && index < 12000){
            $('.product-size__result').text('M');
            product.size = 'm';
        }else if(index >= 12000 && index < 16000){
            $('.product-size__result').text('L');
            product.size = 'l';
        }else if(index >= 16000 && index < 19000){
            $('.product-size__result').text('XL');
            product.size = 'XL';
        }else if(index >= 19000){
            $('.product-size__result').text('XXL');
            product.size = 'XXL';
        }
    }
})(jQuery);

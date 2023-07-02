var imgs = ['http://localhost/public/images/1.jpg', 'http://localhost/public/images/2.jpg', 'http://localhost/public/images/3.jpg']
var index = 0;

function nextImage(c) {
    index = (index + c) % imgs.length;
    if(index == -1) index = imgs.length - 1;
    document.getElementById('right-container').style.backgroundImage = `url(${imgs[index]})`;
    
}
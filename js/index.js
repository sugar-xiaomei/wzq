$(function(){
    setInterval(function(){
        $('.fengmian').css('display','none');
    },2000)
    var canvasS=600;    ///五子棋大,小
    var row=15;       //一排的方格数
    var blockS=canvasS/row;   //每一个小方块的宽高
    $('#canvas').get(0).width=canvasS;
    $('#canvas').get(0).height=canvasS;
     var ctx=$('#canvas').get(0).getContext('2d');
   //  var ctx=document.querySelector('#canvas').getContext('2d');
   var point=[3.5*blockS+0.5,11.5*blockS+0.5];
   var starR=5;
 var draw=function(){
      var jiange=blockS/2+0.5;
      var lineWidth=canvasS-blockS;   //线宽
         //横线
      ctx.save();
      ctx.beginPath();
      for(var i=0;i<row;i++){
        if(i===0){
          ctx.translate(jiange,jiange);
        }else{
          ctx.translate(0,blockS);
        }
        ctx.moveTo(0,0);
        ctx.lineTo(lineWidth,0);
      }

      ctx.stroke();
      ctx.closePath();
      ctx.restore();
     //横线完成  //竖线开始
      ctx.save();
      ctx.beginPath();
      for(var i=0;i<row;i++){
        if(i===0){
          ctx.translate(jiange,jiange);
        }else{
          ctx.translate(blockS,0);
        }
        ctx.moveTo(0,0);
        ctx.lineTo(0,lineWidth);
      }
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
     //竖线结束
     //画四个点
      ctx.save();
      ctx.beginPath();
       for(var i=0;i<2;i++){
         for(var j=0;j<2;j++){
           var x=point[i],y=point[j];
           ctx.moveTo(0,0);
           ctx.arc(x,y,starR,0,Math.PI/180*360);
         }
       }
       ctx.fill();
       ctx.closePath();
       ctx.restore();
        ////画中心点
       ctx.save();
       ctx.beginPath();
       ctx.moveTo(0,0);
       ctx.arc(7.5*blockS+0.5,7.5*blockS+0.5,starR,0,Math.PI/180*360);
       ctx.fill();
       ctx.closePath();
       ctx.restore();
     }
            draw();
       /////放棋子
     var  drop=function(qizi){
         ctx.save();
         ctx.beginPath();
         ctx.translate((qizi.x+0.5)*blockS,(qizi.y+0.5)*blockS);
         ctx.arc(0,0,20,0,(Math.PI)/180*360);
         var jianbian=ctx.createRadialGradient(-5,-6,3,0,0,20);
         if(qizi.color===1){
           jianbian.addColorStop(0.2,'white');
           jianbian.addColorStop(1,'black');
           ctx.fillStyle=jianbian;
           $('#black_play').get(0).play();
         }else{
           jianbian.addColorStop(0.2,'red');
           jianbian.addColorStop(1,'black');
           ctx.fillStyle=jianbian;
           $('#white_play').get(0).play();
         }
         ctx.fill();
         ctx.closePath();
         ctx.restore();
       }
 ////判断棋子
 var panduan=function(qizi){
   var shuju={};
   $.each(all,function(k,v){
     if(v.color===qizi.color){
       shuju[k]=v;
     }
   })
   console.log(shuju)
   var shu=1;hang=1,zuolie=1,youlie=1;
   var tx,ty;
   tx= qizi.x;
   ty= qizi.y;
   while(shuju[tx+'-'+(ty+1)]){
     shu++;tx,ty++;

   }
   tx=qizi.x;
   ty=qizi.y;
   while(shuju[tx+'-'+(ty-1)]){
     shu++;tx,ty--;
   }
   tx=qizi.x;
   ty=qizi.y;
   while(shuju[(tx+1)+'-'+ty]){
     hang++,tx++,ty;
   }
   tx=qizi.x;
   ty=qizi.y;
   while(shuju[(tx-1)+'-'+ty]){
     hang++,tx--;ty;
   }
   tx=qizi.x;
   ty=qizi.y;
   while(shuju[(tx+1)+'-'+(ty+1)]){
     zuolie++;tx++;ty++;
   }
   tx=qizi.x;
   ty=qizi.y;
   while(shuju[(tx-1)+'-'+(ty-1)]){
     zuolie++;tx--;ty--;
   }
   tx=qizi.x;
   ty=qizi.y;
   while(shuju[(tx+1)+'-'+(ty-1)]){
     youlie++;tx++;ty--;
   }
   tx=qizi.x;
   ty=qizi.y;
   while(shuju[(tx-1)+'-'+(ty+1)]){
   youlie++;tx--;ty++;
   }
   if(hang>=5||shu>=5||zuolie>=5||youlie>=5){
       return true;
   }
 }

      /////点击放棋子
       var all={};
       var step=1;
       var kaiguan=true;
     $('#canvas').on('click',function(e){
        var x=Math.floor((e.offsetX)/blockS);
        var y=Math.floor((e.offsetY)/blockS);
        if(all[x+'-'+y]){
          return;
        }
        if(kaiguan){
          var qizi={x:x,y:y,color:1,step:step};
          drop(qizi);
          if(panduan(qizi)){
                $('.box').show().find('#tishi').find('i').text('黑棋赢!!!');

              return;
          }
           kaiguan=false;
        }
        else{
          var qizi={x:x,y:y,color:0,step:step};
          drop(qizi);
          if(panduan(qizi)){
              $('.box').show().find('#tishi').find('i').text('白棋赢!!!');
              return;
          }
            step+=1;
          kaiguan=true;
        }
        all[x+'-'+y]=qizi;
      ///////界面操作


     })
///判断输赢
$(".chongxin").on('click',function(){
  $('.box').hide();
  ctx.clearRect(0,0,600,600);
  draw();
  kaiguan = true;
  all = {};
  step = 1;
})

$('.qipu').on('click',function(){
  $('.box').hide();
  $('#save').css('display','block');
  ctx.save();
  ctx.font = "20px consolas";
  for( var i in all){
    if( all[i].color === 1){
        ctx.fillStyle = 'red';
    }else{
      ctx.fillStyle = 'black';
    }
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(all[i].step,
      (all[i].x+0.5)*blockS,
      (all[i].y+0.5)*blockS);
  }
  ctx.restore();
  var image = $('#canvas').get(0).toDataURL('image/jpg',1);
  $('#save').attr('href',image);
  $('#save').attr('download','qipu.png');
})

$('#close').on('click',function(){
    $('.box').hide();
})
$('.box').on('click',function(){
  $(this).hide();

})

$('#save').on('click',function(){
  $(this).css('display','none');
  ctx.clearRect(0,0,600,600);
  draw();
})



})

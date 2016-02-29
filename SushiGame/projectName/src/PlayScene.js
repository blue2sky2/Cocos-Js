/**
 * Created by LuoXiang on 2016/2/29.
 */
var PlayLayer = cc.Layer.extend({
    //声明其值为null,表示其为引用类型，之后可以用容器存储
    bgSprite : null,
    SushiSprites : null,
    ctor : function(){
        this._super();

        //初始化
        this.SushiSprites = [];

        var size = cc.winSize;

        //添加背景
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x : size.width / 2,
            y : size.height / 2,
            rotation : 180,
        });
        this.addChild(this.bgSprite, 0);

        //计时器中不断添加sushi
        this.schedule(this.update, 1, 16 * 1024, 1);

        return true;
    },
    //添加Sushi方法
    addSushi : function(){
        var sushi = new SushiSprite(res.Sushi_png);
        var size = cc.winSize;

        /**
         * cc.random0To1()返回0-1之间的随机数,Sprite的AnchorPoint都为其中心点,
         * 此循环的逻辑是当sushi一部分或全部显示在屏幕区域外时重新生成其坐标。
         */
        var x = 0;
        do{
            x = sushi.width / 2 + size.width * cc.random0To1();
            if(x > sushi.width / 2 && x < size.width - sushi.width)
                break;
        }while(true);

        sushi.attr({
            x : x,
            y : size.height - 30,
        });
        this.addChild(sushi, 5);
        //将生成的sushi添加到SushiSprites容器中
        this.SushiSprites.push(sushi);

        //加入动作
        var dropAction = cc.MoveTo.create(4, cc.p(sushi.x, -30));
        sushi.runAction(dropAction);
    },
    //删除掉落到底部sushi的方法
    removeSushi : function(){
        for(var i = 0; i < this.SushiSprites.length; i++)
        {
            cc.log("removeSushi...");
            if(0 >= this.SushiSprites[i].y){
                //从场景中移除此Sushi
                this.SushiSprites[i].removeFromParent();
                this.SushiSprites[i] = undefined;
                this.SushiSprites.splice(i, 1);
                i -= 1;
            }
        }
    },
    //用一个定时器不断生成sushi
    update : function(){
        this.addSushi();
        this.removeSushi();
    }
});

var PlayScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});
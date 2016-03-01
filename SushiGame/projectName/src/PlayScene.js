/**
 * Created by LuoXiang on 2016/2/29.
 */
var PlayLayer = cc.Layer.extend({
    //声明其值为null,表示其为引用类型，之后可以用容器存储
    bgSprite : null,
    SushiSprites : null,
    scoreLabel : null,
    score : 0,
    timeoutLabel : null,
    timeout : 60,

    ctor : function(){
        this._super();

        //初始化
        this.SushiSprites = [];

        //加载图片帧
        cc.spriteFrameCache.addSpriteFrames(res.Sushi_plist);

        var size = cc.winSize;

        //添加背景
        this.bgSprite = new cc.Sprite(res.BackGround_png);
        this.bgSprite.attr({
            x : size.width / 2,
            y : size.height / 2,
            rotation : 180,
        });
        this.addChild(this.bgSprite, 0);

        //添加分数标签
        this.scoreLabel = new cc.LabelTTF("score: 0", "Arial", 30);
        this.scoreLabel.attr({
            x : size.width / 2 + 100,
            y : size.height - 20,
        });
        this.addChild(this.scoreLabel, 5);

        //添加计时标签
        this.timeoutLabel = new cc.LabelTTF.create("" + this.timeout, "Arial", 30);
        this.timeoutLabel.attr({
            x : 20,
            y : size.height - 20,
        });
        this.addChild(this.timeoutLabel, 5);

        //调度器中不断添加sushi
        this.schedule(this.update, 1, 16 * 1024, 1);

        //计时器
        this.schedule(this.timer, 1, this.timeout, 1);

        return true;
    },

    //添加Sushi方法
    addSushi : function(){
        var sushi = new SushiSprite("#sushi_1n.png");
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
            //cc.log("removeSushi...");
            if(0 >= this.SushiSprites[i].y){
                //从场景中移除此Sushi
                this.SushiSprites[i].removeFromParent();
                this.SushiSprites[i] = undefined;
                this.SushiSprites.splice(i, 1);
                i -= 1;
            }
        }
    },

    /*通过索引移除sushi,在触摸时移除时调用
      思想为当SushiSprites中元素值不等于索引为index的值时，此索引元素的
      值为原来的值，当相等时跳过此元素。即跳过了索引为index的元素，即实现删除
      了此元素。数组长度-1
     */
    removeSushiByIndex : function(index){
        if(isNaN(index) || index > this.SushiSprites.length - 1)
            return false;
        for(var i = 0, n = 0; i < this.SushiSprites.length; ++i)
        {
            if(this.SushiSprites[i] != this.SushiSprites[index]){
                this.SushiSprites[n] = this.SushiSprites[i];
                ++n;
            }
        }
        this.SushiSprites.length -= 1;
    },

    //用一个定时器不断生成sushi
    update : function(){
        this.addSushi();
        this.removeSushi();
    },

    //计分方法
    addScore : function(){
        this.score += 1;
        this.scoreLabel.setString("score: " + this.score);
    },

    //记时方法
    timer : function(){
        if(0 >= this.timeout){
            var GameOver = new cc.LayerColor(new cc.Color(255, 200, 100, 100));
            var size = cc.winSize;
            var titleLabel = new cc.LabelTTF("Game Over", "Arial", 40);
            titleLabel.attr({
                x : size.width / 2,
                y : size.height / 2
            });
            GameOver.addChild(titleLabel, 5);

            //指的是PlayScene,this为PlayLayer
            this.getParent().addChild(GameOver);

            //移除调度器
            this.unschedule(this.update);
            this.unschedule(this.timer);
            //移除事件监听
            for(var i = 0; i < this.SushiSprites.length; ++i)
            {
                this.SushiSprites[i].removeTouchEventListener();
            }
            return;
        }

        this.timeout -= 1;
        this.timeoutLabel.setString("" + this.timeout);
    }
});

var PlayScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        var layer = new PlayLayer();
        this.addChild(layer);
    }
});
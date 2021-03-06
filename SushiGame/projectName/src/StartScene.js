/**
 * Created by LuoXiang on 2016/2/29.
 */

var StartLayer = cc.Layer.extend({
    ctor : function(){
        this._super();
        //获取屏幕大小
        var size = cc.winSize;

        var helloLabel = new cc.LabelTTF("Hello World", "", 38);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2;
        this.addChild(helloLabel);

        //添加背景图片
        var bgSprite = new cc.Sprite(res.BackGround_png);
        bgSprite.attr({
            x : size.width / 2,
            y : size.height / 2,
        });
        this.addChild(bgSprite, 0);

        //添加开始菜单
        var startItem = new cc.MenuItemImage(
            res.Start_N_png,
            res.Start_S_png,
            function(){
                cc.log("Menu is clicked!");
                //cc.director用来获取导演单例实体，cc.TransitionPageTurn创建了一个翻页效果的场景切换动画。
                //转场动画需要小心浏览器的兼容性。比如翻页效果就在浏览器上不支持
                //cc.director.pushScene(cc.TransitionPageTurn(1, new PlayScene(), false));
                cc.director.pushScene(new PlayScene());
            }, this
        );
        startItem.attr({
            x : size.width / 2,
            y : size.height / 2,
            anchorX : 0.5,
            anchorY : 0.5,
        });

        //将menuItem添加到menu中，并设置menu的属性
        var menu = new cc.Menu(startItem);
        menu.attr({
            x : 0,
            y : 0,
        });
        this.addChild(menu, 1);

        return true;
    }
});

var StartScene = cc.Scene.extend({
    onEnter : function(){
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});
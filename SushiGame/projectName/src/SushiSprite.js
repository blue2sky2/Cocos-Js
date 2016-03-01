/**
 * Created by LuoXiang on 2016/2/29.
 */
var SushiSprite = cc.Sprite.extend({
    /*
    self:null,
    ctor: function () {
        this._super();
        this.self = this;
    },
    */
    //消失动画属性
    disappearAction : null,
    onEnter : function(){

        //为Sprite添加触摸监听器
        this.addTouchEventListener();
        this._super();

        //cc.log("onEnter");

        this.disappearAction = this.createDisappearAction();
        /*
         *下面的retain()方法表示对生成的消失动画增加一次引用。Cocos2d-JS遵循Cocos2d-x的内存管理原则。
         * 下面创建的disappearAction是自动释放的，我们需要为它增加一次引用，以避免它被回收，在我们不
         * 需要的时候对它执行release()方法,释放对它的引用。避免内存泄露。
         */
        this.disappearAction.retain();
    },

    onExit : function(){
        //cc.log("onExit");
        this.disappearAction.release();
        this._super();
    },

    /*添加触摸事件， 在touch事件中，我们还可以添加onTouchMoved/onTouchEnded方法监听touch
      移动和结束的回调。如果onTouchBegan返回false后onTouchMoved/onTouchEnded不会执行。
     */
    addTouchEventListener : function(){
        //新建一个触摸事件监听器
        this.touchListener = cc.EventListener.create({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,
            //在这里onTouchBegan打错导致事件监听无效
            onTouchBegan : function(touch, event){
                //得到触摸点的坐标
                var pos = touch.getLocation();
                //获取当前目标
                var target = event.getCurrentTarget();
                //如果触摸点为当前目标的矩形区域内返回 true,否则返回false
                if(cc.rectContainsPoint(target.getBoundingBox(), pos)){
                    cc.log("Touch");
                    //停止正在播放的所有动作,在此只有下落动作
                    target.stopAllActions();
                    //执行消失帧动画
                    var ac = target.disappearAction;
                    var seqAc = new cc.Sequence(ac, new cc.CallFunc(function(){
                        //更新分数，写在这里以免target被移除后被使用
                        target.getParent().addScore();

                        var removeIndex = target.getParent().SushiSprites.indexOf(target);
                        target.getParent().removeSushiByIndex(removeIndex);
                        target.removeFromParent();
                    }, target));
                    //播放动画
                    target.runAction(seqAc);

                    return true;
                }

                return false;
            }
        });
        cc.eventManager.addListener(this.touchListener, this);
    },

    //移除注册的Touch事件避免再次被点击
    removeTouchEventListener : function(){
        cc.eventManager.removeListener(this.touchListener);
    },

    //帧动画的创建代码
    createDisappearAction : function(){
        var frames = [];
        for(var i = 0; i < 11; i++){
            var str = "sushi_1n_" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            frames.push(frame);
        }

        var animation = new cc.Animation(frames, 0.02);
        var action = new cc.Animate(animation);

        return action;
    }
});

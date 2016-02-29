/**
 * Created by LuoXiang on 2016/2/29.
 */
var SushiSprite = cc.Sprite.extend({
    onEnter : function(){
        this._super();

        //为Sprite添加触摸监听器
        this.addTouchEventListener();
        cc.log("onEnter");
    },

    onExit : function(){
        cc.log("onExit");
    },

    /*添加触摸事件， 在touch事件中，我们还可以添加onTouchMoved/onTouchEnded方法监听touch
      移动和结束的回调。如果onTouchBegan返回false后onTouchMoved/onTouchEnded不会执行。
     */
    addTouchEventListener : function(){
        this.addTouchEventListener = new cc.EventListener({
            event : cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches : true,

            onTouchBegin : function(touch, event){
                //得到触摸点的坐标
                var pos = touch.getLocation();
                //获取当前目标
                var target = event.getCurrentTarget();

                //如果触摸点为当前目标的矩形区域内返回 true,否则返回false
                if(cc.rectContainsPoint(target.getBoundingBox(), pos)){
                    cc.log("Touch");

                    return true;
                }

                return false;
            }
        });
    }
});

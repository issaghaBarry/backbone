/**
 * creation du jeu 2048 sous bacbone
 * 
 * model:
 */

 /**
  * un model pour une valeur qu'on mettra dans une case
  * attribut par defaut sont value et isEdit
  * 
  */
 var SquareModel = Backbone.Model.extend({

    defaults: {
        value: 0,
        x:0,
        y:0,
        isEdit : false,
    },
 })

 

 var SetSquareModel = Backbone.Collection.extend({

    model:SquareModel,
    numberLine:4,
    directionGame:{ //i j pas cordonnée de preécédant
        right: [[0,4,1,0], [1, 4, 1, -1]],
        left: [[0, 4, 1, 0], [2, -1 , -1, 1]],
        up: [[2, -1, -1, 1], [0, 4, 1, 0]],
        down: [[1, 4, 1, -1], [0, 4, 1, 0]]
    },

    giveRandomNumber(value){
        let x1 = _.random(value-1);
        let y1 = _.random(value-1);
        let x2 = _.random(value-1);
        let y2 = _.random(value-1);
        while(x1 == x2){
            x2 = _.random(value-1);
        }
        return [{x:x1, y:y1}, {x:x2, y:y2}]
    },

    getModelAtXY(coord){
        return this.findWhere(coord);
    },

    giveTwoOrFour(){
        let percentage = _.random(100);
        return percentage < 80 ? 2 : 4;
    },

    giveRandomXYNotBusy(){
        let x = _.random(this.numberLine-1);
        let y = _.random(this.numberLine-1);
        let busy = this.getModelAtXY({x:x, y:y}).get('value');
        while(busy!=0){
            x = _.random(this.numberLine-1);
            y = _.random(this.numberLine-1);
            busy = this.getModelAtXY({x:x, y:y}).get('value');
        }
        return {x:x, y:y};
    },

    moveGame(order){
        let ii = this.directionGame[order][0];
        let ji = this.directionGame[order][1];
        for(let i of _.range(ii[0], ii[1], ii[2])){
            let i_prec = i+ii[3];
            for(let j of _.range(ji[0], ji[1], ji[2])){
                let j_prec = j+ji[3];
                let prec = this.getModelAtXY({x:i_prec, y:j_prec});
                let actuel = this.getModelAtXY({x:i, y:j});
                let valprec = prec.get('value');
                let valact = actuel.get('value');
                if(valact==valprec){
                    prec.set('value', 0);
                    actuel.set('value', valact*2);
                }else if(valact==0 && valprec!=0){
                    actuel.set('value', valprec);
                    prec.set('value', 0);
                }
            }
        }
        if(this.findWhere({value:0}))
            this.getModelAtXY(this.giveRandomXYNotBusy()).set('value', this.giveTwoOrFour());
    }
 })

 

 var ViewSquare = Backbone.View.extend({

    tagName: 'td',
    className: 'value',

    model: SquareModel,

    initialize(){
        _.bindAll(this, 'render');
        this.listenTo(this.model, 'change:value', this.render);
    },

    render(){
        let value = this.model.get('value');
        if(value==0){
            this.$el.html('');
        }else{
            this.$el.html(value);
        }
        return this;
    }
 })


var TableView = Backbone.View.extend({


    events:{
        'keypress': 'move',
    },

    move(e){
        console.log(e.keyCode);
    },

    initialize(){
        this.setElement($('#jeu'));
        this.listenTo(this.collection, 'add', this.addtd);
        this.initSetSquare();
    },

    addtd(model){
        let view = new ViewSquare({model: model});
        let idtd = model.get('x');
        this.$(`#${idtd}`).append(view.render().$el);
    },

    initSetSquare(){
        let numberofline = this.collection.numberLine;
        for(let i=0; i<numberofline; i++){
            for(let j=0; j<numberofline; j++){
                this.collection.add(new SquareModel({x:i, y:j}));
            }
        }
        let random = this.collection.giveRandomNumber(numberofline);
        this.collection.getModelAtXY(random[0]).set('value', this.collection.giveTwoOrFour());
        this.collection.getModelAtXY(random[1]).set('value', this.collection.giveTwoOrFour());
    },

    render(){
        return this;
    },
})

var setSquare = new SetSquareModel();
var tableView = new TableView({collection: setSquare});


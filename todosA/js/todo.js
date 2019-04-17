
    /**
     * cette classe represente un service
     * @param name le nom du service
     * @param price le prix du service
     * @param isSelelected  si le service a été selectionné
     */
    var ServiceModel = Backbone.Model.extend({

        default:{
            name: "",
            price: 0,
            isSelected:false,
        },

        toggle(){
            this.set('isSelected', !this.get('isSelected'));
        }

    })

    /**
     * gerer la collection d'un service
     */
    var ListService = Backbone.Collection.extend({

        model: ServiceModel,

        initialize(){
            
        },

        /**
         * donne une array de toute les services qui ont été selectionné
         * @return the array of service selected
         */
        getSelected(){
            return this.where({isSelected: true});
        }
    })

    /**
     * gerer la vue d'un service
     */
    var ViewService = Backbone.View.extend({
        tagName:'li',
        className: 'service',

        events:{
            'click': 'toggleService',
        },

        initialize(){
            _.bindAll(this, 'render');
            this.listenTo(this.model, 'change', this.render);
        },

        render(){
            this.$el.html('<input type="checkbox" value="1" name="' + this.model.get('name') + '" /> ' + this.model.get('name') + '<span>$' + this.model.get('price') + '</span>');
            this.$('input').prop('checked', this.model.get('isSelected'));
            return this;
        },

        toggleService(){
            this.model.toggle();
        }
    })

    var ViewAllService = Backbone.View.extend({
        el:$('#main'),

        initialize(){
            _.bindAll(this, 'render');
            this.total = this.$('#total span');
            this.list = this.$('#services');
            this.listenTo(this.collection, 'add', this.addService);
            this.listenTo(this.collection, 'change', this.render);
            this.init();
        },

        init(){
            this.collection.add(new ServiceModel({name:'coca', price:1.5}));
            this.collection.add(new ServiceModel({name:'redbull', price:2.5}))
            this.collection.add(new ServiceModel({name:'fanta', price:1.2}))            
            this.collection.add(new ServiceModel({name:'orangina', price:1}))
        },

        addService(model){
            let view = new ViewService({model:model});
            this.list.append(view.render().$el);
        },

        render(){
            var total = 0;
            _.each(this.collection.getSelected(), (pmodel)=>{
                total += pmodel.get('price');
            })
            this.total.html(total);
            return this;
        },
    })
var list = new ListService();
var app=  new ViewAllService({collection: list});


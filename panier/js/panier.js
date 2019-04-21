////////////////////////Gestion de la barre /////////////////////////////////////////
/**
 * le model pour un element de la barre latteral
 */
var CBarreModel = Backbone.Model.extend({
    defaults:{
        title:"",
        isSelected: false,
    },

})

var BarModelCollect = Backbone.Collection.extend({
    model: CBarreModel,

})

var ViewCBarreModel = Backbone.View.extend({
    tagName: 'span',
    className: 'el-barr',

    initialize(){
        _.bindAll(this, 'render');
        this.listenTo(this.model, 'change:title', this.render)
    },

    render(){
        this.$el.html(this.model.get('title'));
        return this;
    }
})

var ViewBarre = Backbone.View.extend({
    id:'barre',
    
    events:{
        'click span': 'onClickSpan',
    },

    onClickSpan(e){
        let indexItemClick = $(e.target).index();
        let selectModel = this.collection.findWhere({isSelected: true});
        if(selectModel){
            selectModel.set('isSelected', false);
        }
        this.collection.at(indexItemClick).set('isSelected', true);
    },

    initialize(){
        _.bindAll(this, 'render');
        this.listenTo(this.collection, 'add', this.addSpan);
        this.init();
    },

    init(){
        this.collection.add(new CBarreModel({title: 'Acceuil'}));
        this.collection.add(new CBarreModel({title: 'Panier'}));
    },

    addSpan(model){
        let view = new ViewCBarreModel({model:model});
        this.$el.append(view.render().$el);
    },

    render(){
        return this;
    }
})

var lbarre = new BarModelCollect(); 
var viewBar = new ViewBarre({collection: lbarre});
$('#screen').append(viewBar.render().$el)

/////////////////////Partie Article et gestion de panier///////////////////////////////////////:
var ArticleModel = Backbone.Model.extend({
    defaults:{
        name: "",
        descriptif:"",
        idArticle:0,
        price:0,
        isSelected:false,
        nbSelected:0,
    },

    toggleSelected(){
        this.set('isSelected', true);
    },

    changePrice(price){
        this.set('price', price);
    },

    increaseNbOfSelected(){
        this.set('nbSelected', this.get('nbSelected')+1);
    },

    decreaseNbOfSelected(){
        this.set('nbSelected', this.get('nbSelected')-1);
    },
})

var CatalogueArticle = Backbone.Collection.extend({
    model: ArticleModel,


})

/**
 * vue sur un article
 * lorsque le nom de l'article est modifier le met a jour avec le rendu
 * lorsque l'on click sur le button le met comme selectionnée
 */
var ViewArticle = Backbone.View.extend({
    tagName: 'li',
    
    events:{
        'click button': 'putSelected',
    },

    initialize(){
        _.bindAll(this, 'render');
        this.listenTo(this.model, 'change', this.render);
    },

    putSelected(){
        this.model.toggleSelected();
        this.model.addNbOfSelected();
    },

    render(){
        let content = `<span class="name-arti">${this.model.get('name')}</span>`;
        content += `<button>add</button>`;
        this.$el.html(content);
        return this;
    },
})

//faire de l'heritage en backbone
var ViewArticlePanier = ViewArticle.extend({
    events:{
        'click #bplus': 'increase',
        'click #bmoin': 'decrease',
    },

    increase(){
        ViewArticle.__super__.putSelected.apply(this, arguments);
    },

    redner(){
        let content = `<span class="name-arti">${this.model.get('name')}</span`;
        
    }
});

var ViewCatalogue = Backbone.View.extend({
    tagName: 'ul',
    id:'catalogue',

    initialize(){
        _.bindAll(this, 'addLi', 'render');
        this.listenTo(this.collection, 'add', this.addLi);
        this.init();
    },

    init(){
        this.collection.add(new ArticleModel({name: "coca"}))
        this.collection.add(new ArticleModel({name: "yaourt"}))
        this.collection.add(new ArticleModel({name: "fanta"}))
        this.collection.add(new ArticleModel({name: "mangue"}))
        this.collection.add(new ArticleModel({name: "riz"}))
    },

    addLi(model){
        let view = new ViewArticle({model: model});
        this.$el.append(view.render().$el);
    },

    render(){
        return this;
    }
})

var ViewApp = Backbone.View.extend({
    id:'screen',

    initialize(){
        _.bindAll(this, 'render');
        this.lbarre = new BarModelCollect();
        this.viewBar = new ViewBarre({collection: this.lbarre});
        this.$el.append(viewBar.render().$el);
        this.$el.append('<div id="catal"></div>');
        this.lArticle = new CatalogueArticle();
        this.viewcata = new ViewCatalogue({collection: this.lArticle});
        this.$('#catal').html(this.viewcata.render().$el);
    },

    render(){
        return this;
    }
})

var app = new ViewApp();
$('body').append(app.render().$el);
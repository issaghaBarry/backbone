
// example: backbone is imported
// Add this!




/*a comprendre dans cela
 * CountryView écoute toute modification effectué sur son model( supresion -> suprime le noeud; changhement -> met a jour le noeud)
 * ViewFormulaire écoute tout changement effectué sur l'attribut selected
 * ListView ecoute toute modification effectuez sur l'ajout dans la collection
 * 
 */
var CountryView = Backbone.View.extend({
    tagName: 'li',
    className: 'country',

    initialize() {
        _.bindAll(this, 'render');
        this.listenTo(this.model, 'destroy', () => { this.$el.remove() });
        this.listenTo(this.model, 'change', this.render);
    },

    render(){
        this.$el.html(this.model.get('libelle'));
        return this;      
    }

})


//var vpays = new ViewPays();

//representation d'un pays
//avec des paramètre par default qui m'aiderons lors de l'affichage 
var Pays = Backbone.Model.extend({

    defaults:{
        libelle: 'aaa',
        capital: 'dfhdn',
        langue: 'vdfg',
        ue : false,
        selected:false,
    },

})

//liste de pays
//
var ListPays = Backbone.Collection.extend({
    model: Pays,
    localStorage: new Backbone.LocalStorage("js"),

})

var listPays = new ListPays();

var ListeViews = Backbone.View.extend({
    className:'licountry',

    initialize(){
        //this.render(); le constructeur ne doit jamais appeler render
        //this.listenTo(this.listePays, 'change:libelle', this.miseli);
        this.render();
        this.listenTo(this.collection, 'add', this.addli); //l'evenement add est declenché a chaque ajout d'un element dans la liste
        this.listenTo(this.collection, 'change', this.saveAllCountryToLocalStorage);
        let storage = window.localStorage.getItem('pays2019');
        if(storage){
            this.collection.set(JSON.parse(storage));
        }
    },

    events:{
        'click button#plus': 'addCountryToColleciton', //a chaque click du boutton send on ajoute un element dans la collection
        'click button#moin': 'removeli', //
        'click li.country': 'onListItemClick',
    },

    saveAllCountryToLocalStorage(){
        let val = JSON.stringify(this.collection);
        window.localStorage.removeItem('pays2019');
        window.localStorage.setItem('pays2019', val);
    },

    //suprimé un element dont on connais le pays 
    removeli() {
        let countrySelected = this.collection.findWhere({selected: true});
        if(countrySelected)
            countrySelected.destroy();
        else alert('selected an item')
    },

    //a chaque utilisation de ajoute levenement add est declenché
    addli(model){
        let view = new CountryView({model: model});
        this.$('#list-pays').append(view.render().$el);
    },

    //ajouter un element dans la collection
    //
    addCountryToColleciton() {
        let country = new Pays();
        this.collection.add(country);
    },

    /**
     * 
     * 
     * @param {*} event 
     */
    onListItemClick(event) {
        // Approche 1
        //this.index = $(event.target).index();
        //this.selectedItem = this.listePays.at(this.index);
        // Approche 2
        //selectionnée lelement.et modifier son attribut,
        let indexItemClick = $(event.target).index();
        let countrySelected = this.collection.findWhere({selected: true});
        if(countrySelected) //evité d'avoir plusieur elements selectionnée
            countrySelected.set('selected', false);
        this.collection.at(indexItemClick).set('selected', true);
        // TODO Informer la vue formulaire que son élément a changé via setModel();
        //Souci rencontré lors de savoir si a l'instanciation ajouté un attribut ou faire une dependance
        
    },

    render(){
        let initialContent = '<ul id="list-pays"></ul>';
        initialContent += '<button id=\"plus\">+</button>';
        initialContent += '<button id=\"moin\">-</button>';
        this.$el.html(initialContent);
        return this;
    }
})


var ViewFormulaire = Backbone.View.extend({

    defaults:{
        isEdit: false,
    },

    events: {
        'click button#val': 'updateCountry', //evenement permettant de recuperer une entrée validé
        'click button#an': 'cancelValFormAndPutValModelSelected',
        'keyup #capital': 'cheickInputCapital',
    },

    initialize(){
        //les views ne doit pas s'appeler elle meme
        //this.render(); le rendu ne doit pas etre appeler dans l'initialisation
        this.$el.attr('id', 'sreen-form');
        //this.listenTo(this.model, 'change:selected', this.updateValForm);  //l'écoute sur un element qui a changé n'est plus important
    },

    /**
     * Définit le modèle de la vue.
     * 
     * @param pModel Le modèle à définir sur la vue.
     */
    setModel(pModel) {
        // TODO this.model = pModel; this.render();
        /* Cette méthode doit être appelée par la liste au moment du clic.
        this.model devient une instance de Pays plutôt qu'une collection de type ListPays*/
        this.model = pModel;
        this.isEdit = true;
        this.render();
    },

    cheickInputCapital(){
        let regex = new RegExp("^[a-z]+$");
        let input = this.$('#capital').val();
        if(regex.test(input))
            this.$('#capital').css('background-color', 'green');
        else
            this.$('#capital').css('background-color', '#FFA07A');
    },
    
    cancelValFormAndPutValModelSelected(){
        //let countrySelected = this.model.findWhere({selected: true});
        if(this.model){
            this.updateValForm(this.model);
        }
        else{ 
            alert('select a file');
        }
    },
   

    updateCountry(){
        var p = {
            id: $('#id').val(),
            libelle: $('#libelle').val(),
            capital: $('#capital').val(),
            langue: $('#langue').val(),
            eu : $('#ue').prop('checked'),
        };
        //let countrySelected = this.model.findWhere({selected: true})
        if(this.model){
            this.model.set(p);
        }
        else{ 
            alert('select an item into list item');
        }
    },

    render(){
        //toujour faire en sorte que le domme se double pas
        if(!this.isEdit){
            var contentFormulaire = '<label>ID</label><input id=\"id\"/><br/>';
            contentFormulaire += '<label>Libellé</label><input id=\"libelle\"/><br/>';  
            contentFormulaire += '<label>Capital</label><input id=\"capital\"/><br/>';
            contentFormulaire += '<label>Langue</label><input id=\"langue\"/><br/>';
            contentFormulaire += '<label>UE</label><input id=\"eu\" type=\"checkbox\" checked/><br/>';
            contentFormulaire += '<button id=\"val\">send</button>';
            contentFormulaire += '<button id=\"an\">cancel</button>';
            this.$el.html(contentFormulaire);
        }else{
            this.updateValForm(this.model);
        }
        // TODO Appeler changeValForm voire fusionner les deux méthodes dans render() et utiliser un booléen pour identifier qu'on est en mode update..
        return this;
    },

    changeValForm(pmodel){
        this.$('#libelle').val(pmodel.get('libelle')); //probleme rencontre une fois qu'il la fait la deja ecrit une fois il le fait ^pas une deuxieme fois
        this.$('#id').val(pmodel.get('id'));
        this.$('#capital').val(pmodel.get('capital'));
        this.$('#langue').val(pmodel.get('langue'));
        this.$('#eu').attr('checked', pmodel.get('eu'));
    },

    //cette fonction lors de l'ecoute de la modification du model dans un attribut
    //attribut selected
    updateValForm(model){
        this.changeValForm(model);
    }
})



//var viewAff = new ViewAffichage();
//$('#ecran').append(viewAff.$el);

var formview = new ViewFormulaire();
$('#screen').append(formview.render().$el);
var liview = new ListeViews({collection: listPays})
$('#screen').append(liview.render().$el);
liview.collection.on('change:selected', (model)=>{
    formview.setModel(model);
})
//view.listenTo(viewAff, 'change', view.miseajour)




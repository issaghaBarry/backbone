///////////////////////////////Model Employer////////////////////////////////////
/**
 * observation faite est que si on met deux id identique pour une meme personne le model
 * ne se crée pas
 */
var EmployeeModel = Backbone.Model.extend({
    /**
     * @param type un type qui se trouve etre un model
     */
    defaults:{
        firstName: "",
        lastName:"",
        sex: null,   //0 signifie mal //1 signifie miss, //null pas precisez
        dateBirth: 745027200000,
        countryBird:"33",
        type: null, 
        isSelected: false,
    },

    getAge() {
        return (Date.now() - this.get('dateBirth')) / 86400000 / 365;




        let hourInSecond = 86400000;
        let today = Date.now();
        let dateInDayInS = miliseconde/hourInSecond;
        let todayinS = today/hourInSecond
        let date = todayinS - dateInDayInS;
        return date/365;
    },

    toggleSelected(){
        this.set('isSelected', !this.get('isSelected'));
    },
})

/////////////////////////Collection demployee//////////////////////////////////////
var EmployeesCollection = Backbone.Collection.extend({
    model: EmployeeModel,
})

///////////////////////Vue Pour un Employee/////////////////////////////////////////
/**
 * representation de la vue tr une ligne representant une ligne employee
 * ajout de l'element comme draggable
 */
var ViewEmployee = Backbone.View.extend({
    tagName: 'tr',
    className: 'line-employee',

    initialize(options) {
        _.bindAll(this, 'render');
        this.countries = options.countries;
        this.listenTo(this.model, 'change', this.render);
        this.listenTo(this.model, 'remove', ()=>{this.$el.remove()});
        this.$el.draggable({
            appendTo: 'body',
            revert: 'invalid',
            helper: ()=>{
                return $(`<table><tr>${this.$el.html()}</tr></table>`);
            },
            start: (ev, ui)=>{
                $(ev.target).data('model', this.model);
            }

        })
    },

    render(){
        let content = `<td class="name">${this.model.get('id')}</td>`;
        content += `<td class="name">${this.model.get('firstName')}</td>`;
        content += `<td class="prenom">${this.model.get('lastName')}</td>`;
        let s = this.model.get('sex');
        let pictos = "?";
        if(s==0){
            pictos = '&#9792';
        }else if(s==1){
            pictos = '&#9794'
        }
        content += `<td class="prenom">${pictos}</td>`;
        content += `<td class="prenom">${ Math.ceil(this.model.getAge()).toString() + ' ans'}</td>`;
        content += `<td class="prenom">${this.countries.get(this.model.get('countryBird')).get('libelle')}</td>`;
        this.$el.html(content);
        return this;
    },
})
///////////////////////Vue pour gerer toute la partie affichage du tablleau //////////////////
/**
 * on aurra un div qui contiendra un tableau et deux bouttons plus et moin
 */
var ViewListEmployee = Backbone.View.extend({
    id:'table',
    nbOfElemButPlus: 10,

    events:{
        'click tbody > tr': 'onClickItem',
        'click button#plus': 'addEmployee',
    },

    initialize(options){
        _.bindAll(this, 'render');
        this.countries = options.countries;
        this.listenTo(this.collection, 'add', this.addTr);
        this.$el.data('collection', this.collection);
    },

    addEmployee(event){
        let len = this.collection.length;
        if(len <= this.nbOfElemButPlus){
            this.collection.add(new EmployeeModel({id: _.uniqueId()}));
            // TODO monBouton.attr('disabled', true); // ou removeAttr pour enlever + skinner en CSS avec le pseudo sélecteur :disabled
            event.target.style.backgroundColor = 'white';
        }else{
            event.target.style.backgroundColor = 'grey';
        }
    },

    onClickItem(event){
        let index = $(event.currentTarget).index();//  $('tr.line-employee').index(event.currentTarget);
        let modelSelected = this.collection.findWhere({isSelected: true});
        if(modelSelected) {
            modelSelected.set('isSelected', false);
        }
        this.collection.at(index).set('isSelected', true); 
    },

    addTr(model){
        let view = new ViewEmployee({model:model, countries : this.countries });
        this.$('tbody').append(view.render().$el);
    },

    render(){
        let content = `<table><caption>LISTES D'EMPLOYES</caption>`;
        content += `<thead><tr><th>id</th><th>Nom</th><th>Prenom</th><th>sex</th><th>Age</th><th>Country</th></tr></thead><tbody></tbody>`;
        content += `</table>`;
        content += `<button id="plus">+</button>`;
        this.$el.html(content);
        return this;
    },
})


//var ListE = new EmployeesCollection();
//var v = new ViewListEmployee({collection: ListE});

//$('body').append(v.render().$el);
//ListE.add(new EmployeeModel({id:0, firstName: "toto", lastName: "titi", sex: 0, countryBird:"OYEOYE"}));
//ListE.add(new EmployeeModel({id:13, firstName: "RIEN", lastName: "titi", sex: 0, countryBird:"ANYWHERE"}));
//ListE.add(new EmployeeModel({id:1, firstName: "tata", lastName: "tutu", sex: 1, countryBird:"IYEIYE", age:26}));
////////////////////////////////////////Modification effectuez sur le typeEmploye/////////////////////////////////////////////////
var TypeEmployee = Backbone.Model.extend({
    defaults:{
        class:null,
        label:'',
    }
})

var ListTypeEmployee = Backbone.Collection.extend({
    model: TypeEmployee,
})


var Dev = EmployeeModel.extend({
    defaults: _.extend({}, EmployeeModel.prototype.defaults,{
        valeur: 1050,
    }),
})

var Commercial = EmployeeModel.extend({
    defaults: _.extend({}, EmployeeModel.prototype.defaults, {
        valeur:0,
    })
})

var ChefProject = EmployeeModel.extend({
    defaults: _.extend({}, EmployeeModel.prototype.defaults,{
        valeur: 0,
    }),
})


var typeList = new ListTypeEmployee([{class:EmployeeModel, label:"select", id:0},{class: Dev, label:"Développeur", id:1}, {class: Commercial, label:"Commercial", id:2}, {class: ChefProject, label:"Chef de projet", id:3}]);
///////////////////////////////model pays//////////////////////////////////////////////////////////////////
var CountryModel = Backbone.Model.extend({
    defaults:{
        libelle:""
    }
})

var CountryCollection = Backbone.Collection.extend({
    model: CountryModel,
})

var lCountry = new CountryCollection([{libelle:"France", id:33}, {libelle:"Guinee", id:224}, {libelle:"toto", id:0}]);
////////////////////////////////////////Type D'employer///////////////////////////////////////////////////

// début pierre
/*
var TypeEmployee2 = Backbone.Model.extend({
    defaults: {
        class: null,
        label: ''
    }
});
// [ new TypeEmployee2({ class: Dev, label: "Développeur", id: 1 }) ] ...

// Sur changement de type d'employé :

monEmploye = new monTypeDemployee.get('class')(); // <-- new Dev() / new CDP / new Commercial

var Dev = Employee.extend({
    defaults: {
        nbLignesDeCode: 0
    }
});

// Dans formulaire:
switch(typeEmployee) {
    case 'dev' :

    // Affichage de la sous-partie dev.
}

render() {


    var $select = $('<select>');
    _.each(typesEmployees, (pType) => { $select.append('<option value="' + pType.id + '">' + pType.get('label') + '</option>' ); });
    $select.val(this.model.get('type'));
}

// fin pierre*/



/*var TypeEmployee = Backbone.Model.extend({
    defaults:{
        title: "",
        valeur:0,
        champLabel:"",
        isSelected: false,
        index:0,
    },

    toggleSelected(){
        this.set('isSelected', true);
    }
})
/**
 * type developpeur
 *
var Dev = TypeEmployee.extend({
    initialize(){
        this.set('title', 'Développeurs');
        this.set('champLabel', 'nombre de ligne de code');
    },

})
/**
 * type chef de projet
 *
var ChefProject = TypeEmployee.extend({
    initialize(){
        this.set('title', 'Chef de projet');
        this.set('champLabel', 'Nombre de compte client');
    },
})
/**
 * type commerciaux
 *
var Commercial = TypeEmployee.extend({
    initialize(){
        this.set('title', 'Commerciaux');
        this.set('champLabel', "Chiffre d'affaire");
    },
})

var CollectionType = Backbone.Collection.extend({
    model: TypeEmployee,
})

var ViewTypeOption = Backbone.View.extend({
    tagName:'option',
    className:'option',

    initialize(){
        _.bindAll(this, 'render');
        this.listenTo(this.model, 'change:isSelected', this.render);
    },

    render(){
        this.$el.attr('value', this.model.get('index'));
        let isSelected = this.model.get('isSelected');
        if(isSelected){
            let label = `<br class="type"/><label class="type">${this.model.get('champLabel')}</label>`;
            let inp = `<input class="type" type="number"/><br class="type"/>`;
            this.$el.parent().after(inp);
            this.$el.parent().after(label);
        }else{
            let input = $('.type');
            if(input.length != 0)
                input.remove();
        }
        this.$el.html(this.model.get('title'));
        return this;
    }
})

/**
 * l'evenement change n'est appliqué que sur select input ou textarea
 *
var ViewTypeSelect = Backbone.View.extend({
    tagName: 'select',

    events:{
        'change': 'onClickItem',
    },

    initialize(){
        _.bindAll(this, 'render');
        this.listenTo(this.collection, 'add', this.addOption);
    },

    addOption(model){
        model.set('index', this.collection.length-1);
        let view = new ViewTypeOption({model: model});
        this.$el.append(view.render().$el);
    },

    onClickItem(event){
        let index = parseInt($(event.target).val());
        var select = this.collection.findWhere({isSelected: true});
        if(select){
            select.set('isSelected', false);
        }
        this.collection.at(index).set('isSelected', true);
    },

    render(){
        return this;
    },
})*/

//var collectop = new CollectionType();
//var viewSelect = new ViewTypeSelect({collection: collectop});
//collectop.add(new Dev());
//collectop.add(new ChefProject());
//collectop.add(new Commercial());
/////////////////////////////Formulaire////////////////////////////////////////////////////////////////////////////////
var ViewForm = Backbone.View.extend({
    id:'form',
    

    events:{
        'click #send': 'updateModel',
        'change select.type': 'clickOnItemOption',
    },
    
    initialize(options){
        _.bindAll(this,'render','setModel', 'updateModel', 'updateForm');
        this.listenTo()
        this.listType = options.listTypes;
        this.lcountry = options.countries;
        this.employees = options.employees;
        this.isEdit = false;
    },

    /**
     * gestion du click sur le type demploye
     * @param {*} ev 
     */
    clickOnItemOption(ev){
        let valueOfOption = parseInt($(ev.target).val());
        let typeSelect = this.listType.at(valueOfOption);
        if(this.model){
            this.model.set('type', typeSelect.get('id')); 
        }
        this.manageAdditionalData();
    },

    manageAdditionalData() {
        if(!this.model) {return ;}
        let theRealType = this.listType.get(this.model.get('type'));
        this.$('.additional-data').remove();
        if(!theRealType) { return; }
        let $additionalData = $('<div class="additional-data"></div>');
        switch(theRealType.get('class')){
            case Dev:
                $additionalData.html(`<label class="type">Nombre de ligne de code</label><input class="type" type="number"/>`);
            break;
            case Commercial:
            $additionalData.html(`<label class="type">Nombre de compte client</label><input class="type" type="number"/>`);
            break;
            case ChefProject:
            $additionalData.html(`<label class="type">Nombre de chiffre d'affaire</label><input class="type" type="number"/>`);
            break;
            default:
            return ;
        }
        this.$('button').before($additionalData);
        this.$('button').before("<br class='additional-data'/>");
        this.$('.additional-data').before("<br class='additional-data'/>");
   },

    

    setModel(pModel){
        this.model = pModel;
        this.isEdit = true;
        this.render();
    },

    updateModel(ev){
        ev.preventDefault();
        let valtype = this.$('select.type option:selected').val()
        
        let dateInMili = new Date(this.$('#date').val());
        let attr = {
            id: this.$('#id').val(),
            firstName: this.$('#nom').val(),
            lastName: this.$('#prenom').val(),
            sex: parseInt(this.$('input[name=sex]:checked').val()),
            age: dateInMili.getTime(),
            countryBird: this.$('select.country option:selected').val(),
            valeur: this.$('input.type').val(),
            type:valtype,
            // Ajout PM : 
            // type: this.$('select.type').val() || null
        };
        let typeclas = this.listType.get(attr.type).get('class');
        let typeEmploye = new typeclas(this.model.toJSON());
        typeEmploye.set(attr);
        this.employees.remove(this.model);
        this.employees.add(typeEmploye);
    },

    updateForm(){
        this.$('#id').val(this.model.get('id'));
        this.$('#nom').val(this.model.get('firstName'));
        this.$('#prenom').val(this.model.get('lastName'));
        this.$(`input[name=sex][value=${this.model.get('sex')}]`).attr('checked', true);
        this.$('#date').val(this.model.get('age'));  //la date est dans un format yyyy-MM-JJ;
        // this.$(`select.country option[value=${this.model.get('countryBird')}]`).prop('selected', true);
        this.$('select.country').val(this.model.get('countryBird'));
        let type = this.model.get('type');
        if(type){
            this.$('select.type').val(this.model.get('type'));
        
            this.$('input.type').val(this.model.get('valeur'));
        }
    },

    render(){
        let content = '<form>';
        content += '<label>ID</label><input id="id" disabled type="text"/><br/>';
        content += '<label>Nom</label><input id="nom" type="text"/><br/><label>Prenom</label><input id="prenom" type="text"/><br/>';
        content += '<label class="sex">M</label><input type="radio" name="sex" value="1"/><label class="sex">F</label><input type="radio" name="sex" value="0"/>';
        content += '<br/><label>Date de Naissance</label><input id="date" type="date"/><br/>';
        content += '<label class="country">Country</label><br/><label>Type d employeé</label>';
        content += '<button id="send">send</button>';
        content += '</form>';
        this.$el.html(content);
        let $select2 = $('<select class="country">');
        this.lcountry.each((pCountry)=>{
            $select2.append(`<option value="${pCountry.get('id')}">${pCountry.get('libelle')}</option>`);
        });
        this.$('label.country').after($select2);
        let $select1 = $('<select class="type">');
        let l = this.listType;
        this.listType.each((pType)=>{
            $select1.append(`<option value="${pType.get('id')}">${pType.get('label')}</option>`);
        })
        this.$('#send').before($select1);
        if(!this.model) { return this; }
        this.manageAdditionalData();
        this.updateForm();
        return this;
    }
})

//var viewform = new ViewForm();
//viewform.setListType(typeList);
//viewform.setListeCountry(lCountry);
//$('body').append(viewform.render().$el);
//////////////////////////////////////////////////////////////////////////////////////
/**
 * gère l'application finale 
 * et aussi la partie droppable une fois que levenement est crée
 */
var AppView = Backbone.View.extend({
    id:'screen',

    initialize(){
        _.bindAll(this, 'render');
        this.employeeCollection = new EmployeesCollection();
        this.typeCollection = new ListTypeEmployee([{class:EmployeeModel, label:"select", id:0},{class: Dev, label:"Développeur", id:1}, 
                                                    {class: Commercial, label:"Commercial", id:2}, {class: ChefProject, label:"Chef de projet", id:3}]);
        this.countryCollection = new CountryCollection([{libelle:"France", id:33}, {libelle:"Guinee", id:224}, {libelle:"toto", id:0}]);


        this.viewEmployee = new ViewListEmployee({collection: this.employeeCollection, countries:  this.countryCollection });
        this.viewForm = new ViewForm({ listTypes: this.typeCollection, countries:  this.countryCollection, employees: this.employeeCollection});
        this.listenTo(this.employeeCollection, 'change:isSelected', this.viewForm.setModel);
    },

    initEmployee(collection){
        // collection.reset([ {id:0, firstName: "toto", lastName: "titi", sex: 0, countryBird:"OYEOYE"},   ]);
        collection.add(new Dev({id:0, firstName: "toto", lastName: "titi", sex: 0, countryBird:"33", type: 0}));
        collection.add(new EmployeeModel({id:13, firstName: "RIEN", lastName: "titi", sex: 0, countryBird:"0", type: 1}));
        collection.add(new EmployeeModel({id:1, firstName: "tata", lastName: "tutu", sex: 1, countryBird:"224", type : 2}));
    },

    render(){
        this.$el.children().remove();
        this.$el.append(this.viewEmployee.render().$el);
        this.$el.append(this.viewForm.render().$el);
        this.$el.append($('<div id="poubelle"><img src="img/poubelle.jpg" width="100" height="100"/></div>'));
        this.$('#poubelle').droppable({
            drop: (ev, ui)=>{
                let model = $(ui.draggable).data('model');
                let collection = $('#table').data('collection');
                collection.remove(model);
                $('#poubelle').css('border', '1px solid black');
            },
            over: (ev, ui)=>{
                $('#poubelle').css('border', '2px dashed green');
            }
        })
        return this; 
    }
})

var app = new AppView();
$('body').append(app.render().$el);
app.initEmployee(app.employeeCollection);
//app.drag($('tr.line-employee'));*/

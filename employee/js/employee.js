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
        age: "1999-05-06",
        countryBird:0,
        type: null, 
        isSelected: false,
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

    initialize(){
        _.bindAll(this, 'render');
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
        content += `<td class="prenom">${this.model.get('age')}</td>`;
        content += `<td class="prenom">${this.model.get('countryBird')}</td>`;
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

    events:{
        'click tr.line-employee': 'onClickItem',
        'click button#plus': 'addEmployee',
    },

    initialize(){
        _.bindAll(this, 'render');
        this.listenTo(this.collection, 'add', this.addTr);
        this.$el.data('collection', this.collection);
    },

    addEmployee(event){
        let len = this.collection.length;
        if(len <= 10){
            this.collection.add(new EmployeeModel({id: len}));
            event.target.style.backgroundColor = 'white';
        }else{
            event.target.style.backgroundColor = 'grey';
        }
    },

    onClickItem(event){
        let index = $('tr.line-employee').index(event.currentTarget);
        let modelSelected = this.collection.findWhere({isSelected: true});
        if(modelSelected)
            modelSelected.set('isSelected', false);
        this.collection.at(index).set('isSelected', true); 
    },

    addTr(model){
        let view = new ViewEmployee({model:model});
        this.$('table').append(view.render().$el);
    },

    render(){
        let content = `<table><caption>LISTES D'EMPLOYES</caption>`;
        content += `<tr><th>id</th><th>Nom</th><th>Prenom</th><th>sex</th><th>Age</th><th>Country</th></tr>`;
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

////////////////////////////////////////Type D'employer///////////////////////////////////////////////////
var TypeEmployee = Backbone.Model.extend({
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
 */
var Dev = TypeEmployee.extend({
    initialize(){
        this.set('title', 'Développeurs');
        this.set('champLabel', 'nombre de ligne de code');
    },

})
/**
 * type chef de projet
 */
var ChefProject = TypeEmployee.extend({
    initialize(){
        this.set('title', 'Chef de projet');
        this.set('champLabel', 'Nombre de compte client');
    },
})
/**
 * type commerciaux
 */
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
 */
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

    onClickItem(e){
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
})

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
    },
    
    initialize(){
        _.bindAll(this,'render', 'setModel', 'updateModel', 'updateForm');
        this.select = null;
        this.isEdit = false;
    },

    setViewSelect(pview){
        this.select = pview;
    },

    setModel(pModel){
        this.model = pModel;
        this.isEdit = true;
        this.render();
    },

    updateModel(ev){
        ev.preventDefault();
        let attr = {
            id: this.$('#id').val(),
            firstName: this.$('#nom').val(),
            lastName: this.$('#prenom').val(),
            sex: parseInt(this.$('input[name=sex]:checked').val()),
            age: this.$('#date').val(),
            countryBird: this.$('#country').val(),
            type: this.select.collection.findWhere({isSelected: true}).set('valeur', parseInt(this.$('input[class=type]').val())),
        };
        this.model.set(attr);
    },

    updateForm(){
        this.$('#id').val(this.model.get('id'));
        this.$('#nom').val(this.model.get('firstName'));
        this.$('#prenom').val(this.model.get('lastName'));
        this.$(`input[name=sex][value=${this.model.get('sex')}]`).attr('checked', true);
        this.$('#date').val(this.model.get('age'));  //la date est dans un format yyyy-MM-JJ;
        this.$('#country').val(this.model.get('countryBird'));
        let type = this.model.get('type');
        if(type){
            this.$('div#form select').val(type.get('index'));
            type.set('isSelected', true);
            this.$('label.type + input.type').val(type.get('valeur'));
        }
    },

    render(){
        if(!this.isEdit){
            let content = '<form>';
            content += '<label>ID</label><input id="id" disabled value="1" type="text"/><br/>';
            content += '<label>Nom</label><input id="nom" type="text"/><br/><label>Prenom</label><input id="prenom" type="text"/><br/>';
            content += '<label class="sex">M</label><input type="radio" name="sex" value="1"/><label class="sex">F</label><input type="radio" name="sex" value="0"/>';
            content += '<br/><label>Date de Naissance</label><input id="date" type="date"/><br/>';
            content += '<label>Country</label><input id="country" type="text"/><br/><label>Type d employeé</label>';
            content += '<button id="send">send</button>';
            content += '</form>';
            this.$el.html(content);
            this.$('#send').before(this.select.render().el);
        }else{
            this.updateForm();
        }
        return this;
    }
})

//var viewform = new ViewForm();
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
        this.viewEmployee = new ViewListEmployee({collection: this.employeeCollection});
        this.typeCollection = new CollectionType();
        this.viewSelect = new ViewTypeSelect({collection: this.typeCollection});
        this.initType(this.typeCollection);
        this.viewForm = new ViewForm();
        this.viewForm.setViewSelect(this.viewSelect);
        this.listenTo(this.employeeCollection, 'change:isSelected', this.viewForm.setModel);
    },

    initEmployee(collection){
        collection.add(new EmployeeModel({id:0, firstName: "toto", lastName: "titi", sex: 0, countryBird:"OYEOYE"}));
        collection.add(new EmployeeModel({id:13, firstName: "RIEN", lastName: "titi", sex: 0, countryBird:"ANYWHERE"}));
        collection.add(new EmployeeModel({id:1, firstName: "tata", lastName: "tutu", sex: 1, countryBird:"IYEIYE"}));
    },

    initType(collection){
        collection.add(new Dev());
        collection.add(new ChefProject());
        collection.add(new Commercial());
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
//app.drag($('tr.line-employee'));

/**
 * Probleme restant à gerer 
 * -gestion d'id unique pour une personne 
 * -gestion d'affichage de pays dans la liste
 * -gestion d'affichage dans le formulaire lors d'une modification
 * Solution envisageable
 *      -pour les pays l'identifiant du pays stocké dans la liste deroulante comme valeur {juste que au niveau du tableau on aura un numero}
 *      -
 */
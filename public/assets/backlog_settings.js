App.Views.Shared={EnableBacklogEstimationPreferences:function(a,b){var c=b=="backlog"?"":"_default",d=!1,e=function(){$("input#"+b+"_days_estimatable_false").is(":checked")?(a.find("#"+b+c+"_velocity").rules("add",{required:!1}),a.find("input#velocity_was").val(a.find("input#"+b+c+"_velocity").val()),a.find("input#rate_was").val(a.find("input#"+b+c+"_rate").val()),a.find("input#"+b+c+"_velocity, input#"+b+c+"_rate").val(""),a.find(".cost-elements").hide(),a.find("#days_estimatable_false_label").addClass("selected"),a.find("#days_estimatable_true_label").removeClass("selected")):(a.find("input#"+b+c+"_velocity").rules("add",{required:!0}),a.find("input#velocity_was").val()&&a.find("input#"+b+c+"_velocity").val(a.find("input#velocity_was").val()),a.find("input#rate_was").val()&&a.find("input#"+b+c+"_rate").val(a.find("input#rate_was").val()),a.find("#days_estimatable_true_label").addClass("selected"),a.find("#days_estimatable_false_label").removeClass("selected"),a.find(".cost-elements").slideDown())};return!d&&a.find("input#"+b+"_days_estimatable_false").is(":checked")&&_.include(["","false","f"],a.find("input#account_defaults_set").val())&&($("input#"+b+"_days_estimatable_true").attr("checked",!0),d=!0),e(),$("input#"+b+"_days_estimatable_false, input#"+b+"_days_estimatable_true").change(function(){e()}),e}},App.Views.BacklogCreateUpdateMethods=function(){function b(){var b=$("form#new_backlog, form.edit_backlog");b.validate({rules:{"backlog[name]":{required:!0},"backlog[rate]":{number:!0,min:0},"backlog[velocity]":{number:!0,min:.1}},messages:{"backlog[name]":{required:"You must enter a backlog name",remote:"That backlog name is already taken.  Please enter another name"},"backlog[velocity]":{min:"Please enter a velocity greater than zero"}},success:function(a){a.html("&nbsp;").addClass("correct")}}),a=App.Views.Shared.EnableBacklogEstimationPreferences(b,"backlog"),d(),$("input#backlog_has_company_false, input#backlog_has_company_true").change(function(){c()}),$("a#add_new_company").click(function(a){a.preventDefault(),$(".client-select .existing").hide(),$(".client-select .new").show(),e(),$("input#company_name").focus()}),$("a#select_an_existing_company").click(function(a){a.preventDefault(),$("input#company_name").val(""),$(".client-select .existing").show(),$(".client-select .new").hide(),f(),$("select#backlog_company_id").focus()}),$(".client-select .existing select option").length===0&&$(".client-select .new .select-existing").hide(),$(".not-editable-notice").length&&($('input[type=text],input[type=checkbox],input[name="backlog[scoring_rule_id]"],select').attr("disabled",!0),$("#backlog_has_company_false, #backlog_has_company_true").attr("disabled",!0),$(".client-select .new-company").hide(),$(".not-editable-notice").is(".no-permission")&&$("input[type=radio]").attr("disabled",!0)),c(!0),$("select#backlog_company_id").change(function(){f()})}function c(a){$("input#backlog_has_company_false").is(":checked")?($(".client-select, .client-select .existing, .client-select .new").hide(),$("#has_company_false_label").addClass("selected"),$("#has_company_true_label").removeClass("selected"),e(a)):($("#has_company_true_label").addClass("selected"),$("#has_company_false_label").removeClass("selected"),$(".client-select").show(),$("#backlog_company_id option").length>0?($(".client-select .existing").css("height","auto").slideDown(),$("select#backlog_company_id").focus(),f(a)):($(".client-select .new").css("height","auto").slideDown(),$(".client-select .existing").hide(),$("input#company_name").focus(),e(a)))}function d(){$("input#backlog_rate").data("default",$("input#backlog_rate").val()),$("input#backlog_velocity").data("default",$("input#backlog_velocity").val()),$("input#backlog_use_50_90").data("default",$("input#backlog_use_50_90").attr("checked"))}function e(a){h()||($("input#backlog_rate").val($("input#backlog_rate").data("default")),$("input#backlog_velocity").val($("input#backlog_velocity").data("default")),$("input#backlog_use_50_90").attr("checked",$("input#backlog_use_50_90").data("default")),a||g())}function f(a){if(!h()){var b=$("select#backlog_company_id option:selected").val(),c=document.location.href.match(/\/accounts\/(\d+)\//i);$.getJSON("/accounts/"+c[1]+"/companies/"+b+".json",{},function(b){$("input#backlog_rate").val(b.default_rate),$("input#backlog_velocity").val(b.default_velocity),$("input#backlog_use_50_90").attr("checked",b.default_use_50_90),a||g()})}}function g(){$("input#backlog_velocity").val()?$("input#backlog_days_estimatable_true").attr("checked",!0):$("input#backlog_days_estimatable_false").attr("checked",!0),a()}function h(){return $("form.edit_backlog").length>0}var a;return{initializeManageBacklog:b}}(),App.Views.BacklogSettings={Show:App.Views.BaseView.extend({tagName:"section",className:"content",stateHtml:!1,initialize:function(){App.Views.BaseView.prototype.initialize.call(this),this.sprintTabsView=this.options.sprintTabsView,_.bindAll(this,"storeBacklogSettings","retrieveBacklogSettings","deleteSprint","storeState","stateChanged","restoreState","updateSprint","cancel")},render:function(){return this.model.get("iteration")==="Backlog"?(this.retrieveBacklogSettings(),App.Views.BacklogCreateUpdateMethods.initializeManageBacklog(),this.el=$("section.content .backlog-settings-body")):(this.storeBacklogSettings(),$("section.title h1").html("Sprint "+this.model.get("iteration")+" settings"),$("section.side-panel").html(JST["templates/sprints/sprint-delete-panel"]({model:this.model})),$("section.side-panel a.delete-sprint").click(this.deleteSprint),this.el=$("section.content .backlog-settings-body").html(JST["templates/sprints/edit-sprint"]({model:this.model,backlog:this.model.Backlog()})),this.$("#start-on").datepicker().datepicker("setDate",parseRubyDate(this.model.get("start_on"))),this.$("a#sprint_submit").click(this.updateSprint),this.$("a#sprint_cancel").click(this.cancel),this.disableFieldsIfNotEditable(),this.$("form").validate(App.Views.SharedSprintSettings.formValidationConfig),App.Views.SharedSprintSettings.addFormBehaviour(this.$("form"),this.model.Backlog().get("velocity"))),this.storeState(),this},storeState:function(){this.stateHtml=$(this.el).clone()},stateChanged:function(){return!this.stateHtml||haveFormElementValuesChanged(this.el,this.stateHtml)},restoreState:function(){$(this.el).replaceWith(this.stateHtml)},storeBacklogSettings:function(){App.Views.BacklogSettings.fragments||(App.Views.BacklogSettings.fragments={"section.title .heading":!1,"section.side-panel":!1,"section.main-content-pod .backlog-settings-body":!1},_(App.Views.BacklogSettings.fragments).each(function(a,b){App.Views.BacklogSettings.fragments[b]=$(b).clone()}))},retrieveBacklogSettings:function(){App.Views.BacklogSettings.fragments&&_(App.Views.BacklogSettings.fragments).each(function(a,b){$(b).replaceWith(App.Views.BacklogSettings.fragments[b])}),delete App.Views.BacklogSettings.fragments},deleteSprint:function(a){var b=this;a.preventDefault(),$("#dialog-delete-sprint").remove(),$("body").append(JST["templates/sprints/delete-sprint-dialog"]({iteration:this.model.get("iteration")})),$("#dialog-delete-sprint").dialog({resizable:!1,height:170,modal:!0,buttons:{Delete:function(){var a=this;$(this).find(">p").html('Deleting sprint, please wait<br /><br /><span class="progress-icon"></span>'),$(this).parent().find(".ui-dialog-buttonset button:nth-child(2) span").text("Close"),$(this).parent().find(".ui-dialog-buttonset button:nth-child(1)").remove(),b.model.destroy({success:function(){new App.Views.Notice({message:"Sprint number "+b.model.get("iteration")+" has been deleted"}),b.sprintTabsView.destroy(b.model,function(){$(a).dialog("close")})},error:function(b,c){var d;try{d=JSON.parse(c.responseText).message}catch(e){}d?new App.Views.Error({message:d}):new App.Views.Error({message:"Internal error, unable to delete sprint"}),$(a).dialog("close")}})},Cancel:function(){$(this).dialog("close")}}})},updateSprint:function(a){var b=this;a.preventDefault(),this.$("form").valid()?this.model.IsComplete()?this.$("#sprint_status_completed").is(":checked")?new App.Views.Warning({message:"Nothing has changed so nothing has been updated"}):(this.model.set({completed:"false"}),this.saveSprintFields()):(this.model.set({start_on:$.datepicker.formatDate("yy-mm-dd",this.$("#start-on").datepicker("getDate")),duration_days:this.$("#duration-days").val()}),!this.model.Backlog().get("velocity")||this.$("#use-explicit-velocity").is(":checked")?this.model.set({explicit_velocity:this.$("#explicit-velocity").val(),number_team_members:null}):this.model.set({explicit_velocity:null,number_team_members:this.$("#number-team-members").val()}),this.$("#sprint_status_completed").is(":checked")?this.saveSprintFields(function(){b.saveSprintFields(function(){b.model.set({completed:"true"}),b.saveSprintFields()})}):this.saveSprintFields()):b.$("#form-errors").addClass("form_errors").html("Oops, we could not update the sprint as it looks like you haven't filled in everything correctly.  Please correct the fields marked in red to continue.").hide().slideDown()},saveSprintFields:function(a){var b=this;this.model.save(!1,{success:function(){_.isFunction(a)?a():(new App.Views.Notice({message:"Sprint number "+b.model.get("iteration")+" has been updated"}),b.$("#form-errors").removeClass("form_errors"),b.storeState(),b.disableFieldsIfNotEditable())},error:function(a,c){var d,e;window.console&&console.log(JSON.stringify(c));try{e=JSON.parse(c.responseText).message}catch(f){}e?(b.$("#form-errors").addClass("form_errors").html("Oops, we could not update the sprint as it looks like you haven't filled in everything correctly:<br/>"+e.replace("Validation failed: Completed at ","")).hide().slideDown(),d=new App.Views.Warning({message:"Sprint was not updated.  Please address problems and try again"})):d=new App.Views.Error({message:"An internal error occured and the sprint was not updated.  Please refresh your browser"})}})},disableFieldsIfNotEditable:function(){this.model.IsEditable()||(this.$("#number-team-members, #start-on, #duration-days, #explicit-velocity, input[name=calculation_method]").attr("disabled",!0),this.model.CanEdit()||this.$("input[type=radio][name=sprint_status]").attr("disabled",!0))},cancel:function(a){a.preventDefault(),document.location.href=$("#back-to-backlog").attr("href")}})},App.Routers.BacklogSettings=Backbone.Router.extend({currentIteration:!1,defaultTab:"Backlog",routes:{"":"defaultRoute",":iteration":"viewSprintOrBacklog"},initialize:function(a){_.bindAll(this,"setTabsReference","confirmDiscardChanges")},setTabsReference:function(a){this.sprintTabsView=a},defaultRoute:function(){this.viewSprintOrBacklog(this.defaultTab)},viewSprintOrBacklog:function(a){var b=this.sprintTabsView.getModelFromIteration(a),c=this;if(!b){b=this.sprintTabsView.getModelFromIteration(this.defaultTab);if(!b)var d=new App.Views.Error({message:"Internal error, could not display default tab correctly.  Please refresh your browser"})}$("a#back-to-backlog").attr("href",$("a#back-to-backlog").attr("href").replace(/#[\d\w_-]*$/,"")+"#"+a),this.confirmDiscardChanges(function(){c.view&&c.view.restoreState(),c.view=new App.Views.BacklogSettings.Show({model:b,sprintTabsView:c.sprintTabsView}),c.view.render(),c.sprintTabsView.select(b),c.currentIteration=b.get("iteration")},function(){c.sprintTabsView.restoreTab(c.currentIteration),c.navigate(String(c.currentIteration))})},confirmDiscardChanges:function(a,b){this.currentIteration&&this.view.stateChanged()?($("#dialog-changed-confirm").remove(),$("body").append(JST["templates/sprints/changed-confirm-dialog"]()),$("#dialog-changed-confirm").dialog({resizable:!1,height:170,modal:!0,buttons:{"Discard changes":function(){a(),$(this).dialog("close")},Cancel:function(){b(),$(this).dialog("close")}}})):a()}});
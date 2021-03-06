
Hooks.on("preUpdateScene", async (entity, data, update, userID) => {
	
	if(data.darkness == null) // no change to darkness level, no need to be here
	{
		return;
	}
	
	if(entity.data._id == canvas.scene.data._id)
	{
		if(entity.data.darkness < 0.5 && data.darkness > 0.5)
		{
			//console.log("To Darkness");
			changeLighting();
		}
		if(entity.data.darkness > 0.5 && data.darkness < 0.5)
		{
			//console.log("To Daylight");
			changeLighting();
		}		
	}

});

async function changeLighting(){
		
	canvas.lighting.updateMany(canvas.scene.data.lights.map(l => {
		
		if(l.flags.daynightlights  && (l.flags.daynightlights.lightsData.dynamicLight == true || l.flags.daynightlights.lightsData.dynamicLight == "true"))
		{			
			let newFlag = {
				daynightlights: {
					lightsData: {
					
						dynamicLight: true,
						t: l.flags.daynightlights.lightsData.t == "c" ? "c" : l.t.valueOf(),
						x: l.flags.daynightlights.lightsData.x != null ? l.x.valueOf() : null,
						y: l.flags.daynightlights.lightsData.y != null ? l.y.valueOf() : null,
						dim: l.flags.daynightlights.lightsData.dim != null ? l.dim.valueOf() : null, //l.dim.valueOf(),
						bright: l.flags.daynightlights.lightsData.bright != null ? l.bright.valueOf() : null, //l.bright.valueOf(),
						angle: l.flags.daynightlights.lightsData.angle != null ? l.angle.valueOf() : null, //angle: l.angle.valueOf(),
						rotation: l.flags.daynightlights.lightsData.rotation != null ? l.rotation.valueOf() : null, //rotation: l.rotation.valueOf(),
						tintAlpha: l.flags.daynightlights.lightsData.tintAlpha != null ? l.tintAlpha.valueOf() : null, // l.tintAlpha.valueOf(),
						darknessThreshold: l.flags.daynightlights.lightsData.darknessThreshold != null ? l.darknessThreshold.valueOf() : null, //l.darknessThreshold.valueOf(),
						locked: false,
						tintColor: l.tintColor.valueOf()
					}
				}
			};
			
			let lightsData = l.flags.daynightlights.lightsData;
			
			return {_id: l._id,
				t: lightsData.t != "c" ? lightsData.t : l.t,
				x: lightsData.x != null ? lightsData.x : l.x,
				y: lightsData.y != null ? lightsData.y : l.y,
				dim: lightsData.dim != null ? lightsData.dim : l.dim,
				bright: lightsData.bright != null ? lightsData.bright : l.bright,
				angle: lightsData.angle != null ? lightsData.angle : l.angle,
				rotation: lightsData.rotation != null ? lightsData.rotation : l.rotation,
				tintAlpha: lightsData.tintAlpha != null ? lightsData.tintAlpha : l.tintAlpha,
				darknessThreshold: lightsData.darknessThreshold != null ? lightsData.darknessThreshold : l.darknessThreshold,
				tintColor: lightsData.tintColor != null ? lightsData.tintColor : l.tintColor,
				flags: newFlag
				};
		}
		
		return {_id: l._id};
	}));
	
	ui.notifications.info(`Lights Changed`);
}

Hooks.on("renderLightConfig", (app, html, data) => {
	
	let thisLight;
	if(app.object.getFlag("daynightlights", "lightsData") == null)
	{
		let dayNightData = app.object;
		thisLight =
		{
			dynamicLight: false,
			t: "c",
			x: null,
			y: null,
			dim: null,
			bright: null,
			angle: null,
			rotation: null,
			tintAlpha: null,
			darknessThreshold: null,
			locked: false,
			tintColor: ""
		};
		app.object.setFlag("daynightlights", "lightsData", thisLight);
	}
	else
	{
		thisLight = app.object.getFlag("daynightlights", "lightsData");
	}

	let message;
	let message2;
	
	if(thisLight.dynamicLight == true || thisLight.dynamicLight == "true")
	{
		
		app.setPosition({
			height: 835,
			width: 400
		});
		
		message = `
		<div class="form-group"> 
			<label>Dynamic Day/Night Light</label>
			<select name="flags.daynightlights.lightsData.dynamicLight">
				<option value=true >True</option>
				<option value=false >False</option>			
			</select>
		</div>
		<div class="form-group"> 
			<label>Current Light Settings: </label>
		</div>
		`
		
		message2 = 
		
		`
		<div class="form-group"> 
			<label>Alternative Light Settings: </label>
		</div>
		
		<div class="form-group">
			<label>Light Type</label>
			<select name="flags.daynightlights.lightsData.t" data-dtype="String">
				<option value="${thisLight.t == "c" ? "c" : thisLight.t }">${thisLight.t == "c" ? "Current Light" : thisLight.t == "l" ? "Local" : "Global"}</option>
				<option value="c">Current Light</option>
				<option value="l">Local</option>
				<option value="g">Global</option>
			</select>
		</div>

		<div class="form-group">
			<label>X-Position <span class="units">(Pixels)</span>:</label>
			<input type="text" name="flags.daynightlights.lightsData.x" placeholder="Current-X" value=${thisLight.x == null ? "Current-X" : thisLight.x} data-dtype="Number">
		</div>
		
		<div class="form-group">
			<label>Y-Position <span class="units">(Pixels)</span>:</label>
			<input type="text" name="flags.daynightlights.lightsData.y" placeholder="Current-Y" value=${thisLight.y == null ? "Current-Y" : thisLight.y} data-dtype="Number">
		</div>

		<div class="form-group">
			<label>Dim Radius <span class="units">(Grid Units)</span>:</label>
			<input type="text" name="flags.daynightlights.lightsData.dim" placeholder="Current-Dim" value=${thisLight.dim == null ? "Current-Dim" : thisLight.dim} data-dtype="Number">
		</div>

		<div class="form-group">
			<label>Bright Radius <span class="units">(Grid Units)</span>:</label>
			<input type="text" name="flags.daynightlights.lightsData.bright" placeholder="Grid Units" value=${thisLight.bright == null ? "Current-Bright-Radius" : thisLight.bright} data-dtype="Number">
		</div>

		<div class="form-group">
			<label>Emission Angle <span class="units">(Degrees)</span>:</label>
			<input type="text" name="flags.daynightlights.lightsData.angle" value=${thisLight.angle != null ? thisLight.angle : app.object.data.angle} data-dtype="Number">
		</div>

		<div class="form-group">
			<label>Rotation <span class="units">(Degrees)</span>:</label>
			<input type="text" name="flags.daynightlights.lightsData.rotation" placeholder="Current-Rotation" value=${thisLight.rotation == null ? "Current-Rotation" : thisLight.rotation} data-dtype="Number">
		</div>
		
		<div class="form-group">
			<label>Light Color</label>
			<input class="color" type="text" name="flags.daynightlights.lightsData.tintColor" value="${thisLight.tintColor}" data-dtype="String" >
			<input type="color" value="${thisLight.tintColor}" data-edit="flags.daynightlights.lightsData.tintColor">
		</div>

		<div class="form-group">
			<label>Light Opacity</label>
			<div class="form-fields">
				<input type="range" name="flags.daynightlights.lightsData.tintAlpha" value=${thisLight.tintAlpha != null ? thisLight.tintAlpha : app.object.data.tintAlpha} min="0.0" max="1.0" step="0.05" data-dtype="Number">
				<span class="range-value">0.5</span>
			</div>
		</div>

		<div class="form-group">
			<label>Darkness Threshold</label>
			<div class="form-fields">
				<input type="range" name="flags.daynightlights.lightsData.darknessThreshold" value=${thisLight.darknessThreshold != null ? thisLight.darknessThreshold : app.object.data.darknessThreshold} min="0.0" max="1.0" step="0.05" data-dtype="Number">
				<span class="range-value">0</span>
			</div>
			<p class="hint">If a darkness threshold is set, this light will be visible only when the Scene darkness level exceeds that threshold.</p>
		</div>		
		`
		html.find(".form-group").first().before(message);
		html.find(".form-group").last().after(message2);
		
	}
	else
	{
		app.setPosition({
			height: 445,
			width: 400
		});
		
		message = 	`
		<div class="form-group"> 
			<label>Dynamic Day/Night Light</label>
			<select name="flags.daynightlights.lightsData.dynamicLight">
				<option value=false >False</option>
				<option value=true >True</option>		
			</select>
		</div>
	`
	html.find(".form-group").first().before(message);
	}
});

Hooks.on("getSceneControlButtons", function(controls){
		
	controls[5].tools.splice(controls[5].tools.length,0,{
      name: "close",
      title: "Change Lights",
      icon: "fas fa-clock",
      onClick: () => {
		    changeLighting();
	    },
      button: true
  })
  return controls;
	
})
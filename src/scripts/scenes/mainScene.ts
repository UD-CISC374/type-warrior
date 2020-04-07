import ExampleObject from '../objects/exampleObject';


export default class MainScene extends Phaser.Scene {
  private exampleObject: ExampleObject;
  private player;
  private background;
  private cursorKeys;
  private spacebar;
  private words;
  private wordLabel;
  private a; private b; private c; private d; private e; private f;
  private g; private h; private i; private j; private k; private l;
  private m; private n; private o; private p; private q; private r;
  private s; private t; private u; private v; private w; private x; 
  private y; private z; private del;

  constructor() {
    super({ key: 'MainScene' });
  }

  create() {
    this.background = this.add.tileSprite(0,0, this.scale.width, this.scale.height, "background");
    this.background.setOrigin(0,0);

    this.player = this.add.image(this.scale.width/2 - 50, this.scale.height/2 - 20, "standing");
    this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.b = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);
    this.c = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.e = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    this.f = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.g = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G);
    this.h = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    this.i = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    this.j = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J);
    this.k = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
    this.l = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.m = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    this.n = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N);
    this.o = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    this.p = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.q = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.r = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    this.s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.t = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.T);
    this.u = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.U);
    this.v = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.V);
    this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.x = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.y = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Y);
    this.z = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.del = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);

    this.words = "";
    
    this.wordLabel = this.add.bitmapText(10, 5, "pixelFont", "Command", 16);
  }

  update() {
    this.wordLabel.text = "Command:    " + this.words;
    this.addLetters();
    this.movePlayer();
  }

  addLetters(){
    if(Phaser.Input.Keyboard.JustDown(this.a)){
      this.words += "a";
    }
    if(Phaser.Input.Keyboard.JustDown(this.b)){
      this.words += "b";
    }
    if(Phaser.Input.Keyboard.JustDown(this.c)){
      this.words += "c";
    }
    if(Phaser.Input.Keyboard.JustDown(this.d)){
      this.words += "d";
    }
    if(Phaser.Input.Keyboard.JustDown(this.e)){
      this.words += "e";
    }
    if(Phaser.Input.Keyboard.JustDown(this.f)){
      this.words += "f";
    }
    if(Phaser.Input.Keyboard.JustDown(this.g)){
      this.words += "g";
    }
    if(Phaser.Input.Keyboard.JustDown(this.h)){
      this.words += "h";
    }
    if(Phaser.Input.Keyboard.JustDown(this.i)){
      this.words += "i";
    }
    if(Phaser.Input.Keyboard.JustDown(this.j)){
      this.words += "j";
    }
    if(Phaser.Input.Keyboard.JustDown(this.k)){
      this.words += "k";
    }if(Phaser.Input.Keyboard.JustDown(this.l)){
      this.words += "l";
    }if(Phaser.Input.Keyboard.JustDown(this.m)){
      this.words += "m";
    }if(Phaser.Input.Keyboard.JustDown(this.n)){
      this.words += "n";
    }if(Phaser.Input.Keyboard.JustDown(this.o)){
      this.words += "o";
    }if(Phaser.Input.Keyboard.JustDown(this.p)){
      this.words += "p";
    }if(Phaser.Input.Keyboard.JustDown(this.q)){
      this.words += "q";
    }if(Phaser.Input.Keyboard.JustDown(this.r)){
      this.words += "r";
    }if(Phaser.Input.Keyboard.JustDown(this.s)){
      this.words += "s";
    }if(Phaser.Input.Keyboard.JustDown(this.t)){
      this.words += "t";
    }if(Phaser.Input.Keyboard.JustDown(this.u)){
      this.words += "u";
    }if(Phaser.Input.Keyboard.JustDown(this.v)){
      this.words += "v";
    }if(Phaser.Input.Keyboard.JustDown(this.w)){
      this.words += "w";
    }if(Phaser.Input.Keyboard.JustDown(this.x)){
      this.words += "x";
    }if(Phaser.Input.Keyboard.JustDown(this.y)){
      this.words += "y";
    }if(Phaser.Input.Keyboard.JustDown(this.z)){
      this.words += "z";
    }
    if(Phaser.Input.Keyboard.JustDown(this.del)){
      this.words = "";
    }
    if(Phaser.Input.Keyboard.JustDown(this.spacebar)){
      this.words += " ";
    }

  }

  movePlayer(){
    if(this.words == "move left"){
       this.player.x -= 25;
       this.words = "";
    }
    
    if(this.words == "move right"){
      this.player.x += 25;
      this.words = "";
   }
  }
}

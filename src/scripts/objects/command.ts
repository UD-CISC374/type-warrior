export default class Command{
    public name: string;
    public description: string;
    public unlocked: boolean;
    
    constructor(n: string, d: string, b: boolean){
        this.name = n;
        this.description = d;
        this.unlocked = b;
    }

    public discover(){
        this.unlocked = true;
    }

    public getName(){
        return this.name;
    }

    public getDescrip(){
        return this.description;
    }

    public isUnlocked(){
        return this.unlocked;
    }
}
class EnemyMotion {
    constructor(motionManager) {       
        this.motionManager = motionManager;
    }

    moveUp(actor) {
        let nextY = actor.position.y - actor.speed;

        // check collisions and scene bobunds
        if (this.motionManager.isCollisionExists(actor.id, actor.position.x, nextY, actor.width, actor.height) ||
            (nextY - actor.height/2 <= 0)) {
            actor.rotate('down');
            return;
        }
        actor.position.y = nextY;        
    }

    moveDown(actor) {
        let nextY = actor.position.y + actor.speed;
        let {height} = this.motionManager.renderer.getSize();        

        if (this.motionManager.isCollisionExists(actor.id, actor.position.x, nextY, actor.width, actor.height) || 
            (nextY + actor.height/2 >= height)) {
            actor.rotate('up');
            return;
        }
        actor.position.y = nextY;
    }

    moveRight(actor) {
        let nextX = actor.position.x + actor.speed;
        let {width} = this.motionManager.renderer.getSize();                

        if (this.motionManager.isCollisionExists(actor.id, nextX, actor.position.y, actor.width, actor.height) || 
            (nextX + actor.width/2 >= width)) {
            actor.rotate('left');
            return;
        }
        actor.position.x = nextX;
    }

    moveLeft(actor) {
        let nextX = actor.position.x - actor.speed;

        if (this.motionManager.isCollisionExists(actor.id, nextX, actor.position.y, actor.width, actor.height) ||
            (actor.position.x - actor.speed - actor.width/2 <= 0)) {
            actor.rotate('right');
            return;
        }
        actor.position.x = nextX;        
    }
}

export default EnemyMotion;

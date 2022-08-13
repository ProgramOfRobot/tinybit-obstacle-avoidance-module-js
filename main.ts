namespace ObstacleAvoidance {
    export namespace Data {
        export let isRunning  = false;
        export let isStopped  = false;
        export let isFastMode = true;
        export let delayTime  = 350;
        export const ultrasonic = {
            FAST: {
                distance: 30
            },
            SLOW: {
                distance: 24
            }
        };
        export const running = {
            FAST: {
                runningSpeed: 225
            },
            SLOW: {
                runningSpeed: 105
            }
        };
        export const turning = {
            FAST: {
                turningSpeed: 170, // 170
                turningTime: 125 // 250
            },
            SLOW: {
                turningSpeed: 95, // 95
                turningTime: 250 // 500
            }
        };

        export function getUltrasonic() {
            if (isFastMode) {
                return ultrasonic.FAST;
            } else {
                return ultrasonic.SLOW;
            }
        }

        export function getRunning() {
            if (isFastMode) {
                return running.FAST;
            } else {
                return running.SLOW;
            }
        }

        export function getTurning() {
            // if (isFastMode) {
            //     return turning.FAST;
            // } else {
            //     return turning.SLOW;
            // }
            return turning.FAST;
        }

        function changeFastMode() {
            isFastMode = !isFastMode;
        }

        function changeRunning() {
            isRunning = !isRunning;
        }
    };

    export namespace CarControlling {
        function spinTurn(direction: Tinybit.CarState, times: number = 1) {
            carStop();
            while (times > 0) {
                const turning = Data.getTurning()
                Tinybit.CarCtrlSpeed(direction, turning.turningSpeed);
                basic.pause(turning.turningTime);
                Tinybit.CarCtrl(Tinybit.CarState.Car_Stop);
                basic.pause(Data.delayTime);
                times--;
            }
        }
        
        export function carForward() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Run, Data.getRunning().runningSpeed);
        }

        export function carBackward() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Back, Data.getRunning().runningSpeed);
        }

        export function carTurnLeft(times: number = 1) {
            spinTurn(Tinybit.CarState.Car_SpinLeft, times);
        }

        export function carTurnRight(times: number = 1) {
            spinTurn(Tinybit.CarState.Car_SpinRight, times);
        }

        export function carStop() {
            Tinybit.CarCtrlSpeed(Tinybit.CarState.Car_Back, 30);
            basic.pause(100);
            Tinybit.CarCtrl(Tinybit.CarState.Car_Stop);
        }

        export function ifAnyObstacleFronted(ifTrue: () => void): boolean {
            if (Tinybit.Ultrasonic_Car() <= Data.getUltrasonic().distance) {
                ifTrue();
                return true;
            } else {
                return false;
            }
        }
    }

    export function initialize() {
        
    }

    export function runEachLoop() {
        CarControlling.ifAnyObstacleFronted(() => {
            CarControlling.carStop();
            CarControlling.carTurnLeft();
            CarControlling.ifAnyObstacleFronted(() => {
                CarControlling.carTurnRight(2);
                CarControlling.ifAnyObstacleFronted(() => {
                    CarControlling.carTurnRight();
                });
            });
        });
        CarControlling.carForward();
    }
};

basic.forever(() => {
    ObstacleAvoidance.runEachLoop();
})
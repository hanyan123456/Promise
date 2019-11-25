/*
 * @Author: 寒嫣
 * @Date: 2019-11-22 13:56:27
 * @Description: file content
 */

function MyPromise(executor) {
	var self = this
	self.status = 'pending';
	self.reasonValue = null;
	self.rejectReason = null;
	self.ResolveCallBackList = [];
	self.RejectCallBackList = [];

	function resolve(value) {
		if (self.status === 'pending') {
			self.status = 'Fulfilled'
			self.reasonValue = value
			self.ResolveCallBackList.forEach(ele => {
				ele();
			});
		}
	}

	function reject(reason) {
		if (self.status === 'pending') {
			self.status = 'Rejected'
			self.rejectReason = reason
			self.RejectCallBackList.forEach(ele => {
				ele();
			});
		}
	}

	try {
		executor(resolve, reject);
	} catch (e) {
		reject(e)
	}

};

MyPromise.prototype.then = function (onFulfilled, onRejected) {
	var self = this;
	if (!onFulfilled) {
		onFulfilled = function (val) {
			return val
		}
		if (!onRejected) {
			onRejected = function (reason) {
				throw new Error(reason)
			}
		}
	}
	var nextPromise = new MyPromise(function (res, rej) {
		if (self.status === 'Fulfilled') {
			setTimeout(() => {
				try {
					var nextReasolveValue = onFulfilled(self.reasonValue)
					res(nextReasolveValue)
				} catch (e) {
					rej(e)
				}
			}, 0);

		}
		if (self.status === 'Rejected') {
			try {
				var nextRejectValue = onRejected(self.rejectReason)
				res(nextRejectValue)
			} catch (e) {
				rej(e)
			}


		}
		if (self.status === 'pending') {
			self.ResolveCallBackList.push(function () {
				try {
					var nextReasolveValue = onFulfilled(self.reasonValue)
					res(nextReasolveValue)
				} catch (e) {
					rej(e)
				}

			});
			self.RejectCallBackList.push(function () {
				// onFulfilled(self.reasonValue)
				try {
					var nextReasolveValue = onFulfilled(self.reasonValue)
					res(nextReasolveValue)
				} catch (e) {
					rej(e)
				}

			})
		}
	})

}
const bplus = require('buzztree')

const {InternalNode, Bucket} = bplus.data

function getApi(txn) {
	return {
		create(node) {
			let ref
			let stringForm
			let refs
			const {rootRef, keys, children, terminalNode, nextBucket, prevBucket} = node
			if (rootRef !== undefined) {
				stringForm = JSON.stringify({rootRef: true})
				refs = [rootRef]
				ref = txn.create(Buffer.from(stringForm), refs)
			} else if (terminalNode) {
				ref = txn.create(new Buffer(0), [])
				stringForm = JSON.stringify({keys, children, terminalNode})
				refs = [nextBucket || ref, prevBucket || ref]
				txn.write(ref, Buffer.from(stringForm), refs)
			} else {
				stringForm = JSON.stringify({keys, terminalNode})
				refs = children
				ref = txn.create(Buffer.from(stringForm), refs)
			}
			console.log("create", ref.toString(), stringForm, "[" + refs.join(",") + "]")
			return ref
		},
		update(ref, node) {
			let stringForm
			let refs
			const {rootRef, keys, children, terminalNode, nextBucket, prevBucket} = node
			if (rootRef !== undefined) {
				stringForm = JSON.stringify({rootRef: true})
				refs = [rootRef]
				txn.write(ref, Buffer.from(stringForm), refs)
			} else if (terminalNode) {
				stringForm = JSON.stringify({keys, children, terminalNode})
				refs = [nextBucket || ref, prevBucket || ref]
				txn.write(ref, Buffer.from(stringForm), refs)
			} else {
				stringForm = JSON.stringify({keys, terminalNode})
				refs = children
				txn.write(ref, Buffer.from(stringForm), refs)
			}
			console.log("update", ref.toString(), stringForm, "[" + refs.join(",") + "]")
		},
		read(ref) {
			const serializedNode = txn.read(ref)
			const string = Buffer.from(serializedNode.value).toString()
			const {rootRef, keys = [], children = [], terminalNode} = JSON.parse(string)
			const refs = serializedNode.refs
			if (rootRef === true) {
				return {root: refs.length > 0 ? this.read(refs[0]) : undefined }
			} else if (terminalNode === false) {
				result = new InternalNode(keys, refs)
			} else {
				result = new Bucket(keys, children, refs[0] !== ref ? refs[0] : undefined, refs[1] !== ref ? refs[1] : undefined)
			}
			result.ref = ref
			console.log('read', ref.toString(), string, "[" + serializedNode.refs.join(",") + "]")
			return result
		},
		remove(ref) {
			console.log(`unimplemented: goshawk remove ${ref.toString()}`)
		}
	}
}

module.exports = {getApi}
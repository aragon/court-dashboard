//
//  SwiftAEGlueSupport.swift
//  AppleEventBridge
//
//  Base classes for aebglue-generated Swift application glues.
//

// note: AEBAppData uses AEMCodecs to unpack basic AE types (text, list, etc) as NSObjects; TO DO: would it be better to unpack them as native Swift types (and would Swift objects cause any issues with other NSObject-based APIs such as AEMQuery)?

// TO DO: rename returnType arg to requestedType? need to decide how best to implement generics support in commands, e.g. get(asType:[String].Type) would specify return type _and_ coercions to apply as value is unpacked (note: this'll require enhancing AEMCodecs and instrospecting types)

import Foundation
import AppKit
import AppleEventBridge


/******************************************************************************/
// AppData class 
//
// Holds an AEMApplication instance targeting the specified application, and converts Swift/Cocoa objects to/from AEDescs.
// Created when the glue's Application class is instantiated, and passed to all Specifiers constructed from that Application.
//


class SwiftAEAppData: AEBStaticAppData {
        
    override func unpackCompDescriptor(desc: NSAppleEventDescriptor) throws -> AnyObject { // TO DO: throw error -1726 if invalid operand(s)
        let operatorCode = desc.descriptorForKeyword(AEM4CC("relo"))!.enumCodeValue // keyAECompOperator
        var op1 = try self.unpack(desc.descriptorForKeyword(AEM4CC("obj1"))) // keyAEObject1
        var op2 = try self.unpack(desc.descriptorForKeyword(AEM4CC("obj2"))) // keyAEObject2
        // note: unlike ObjC glues, SwiftAESpecifier isn't polymorphic with AEMQuery where test clause methods are concerned (preferring to use overloaded operators instead); one option would be to implement greaterThan, etc. on glue specifiers, allowing existing AEMCodecs.unpackCompDescriptor() to unpack them; for now though, let's just unwrap the underlying AEMQuerys and work on those (there's no real reason to unpack comparison and logic descriptors as SwiftAESpecifiers since they normally only occur inside other specifiers)
        if op1 is AEMQueryProtocol {
            op1 = op1.aemQuery
        }
        if op2 is AEMQueryProtocol {
            op2 = op2.aemQuery
        }
        // TO DO: it might be best if AEMCodecs split unpackCompDescriptor into separate unpack and apply methods
        switch operatorCode {
        case AEM4CC(">   "):
            // note: these will throw exception if first operand is not an objSpec; TO DO: if op1 is not an AEMQuery but op2 is, should operands and operator be reversed, e.g. op1.greaterThan(op2) -> op2.lessOrEquals(op1); the AEOM spec is no help, of course (one option would be to check how AS packs them)
            return (op1 as! AEMObjectSpecifier).greaterThan(op2)
        case AEM4CC(">=  "):
            return (op1 as! AEMObjectSpecifier).greaterOrEquals(op2)
        case AEM4CC("=   "):
            return (op1 as! AEMObjectSpecifier).equals(op2)
        case AEM4CC("<   "):
            return (op1 as! AEMObjectSpecifier).lessThan(op2)
        case AEM4CC("<=  "):
            return (op1 as! AEMObjectSpecifier).lessOrEquals(op2)
        case AEM4CC("bgwt"):
            return (op1 as! AEMObjectSpecifier).beginsWith(op2)
        case AEM4CC("ends"):
            return (op1 as! AEMObjectSpecifier).endsWith(op2)
        case AEM4CC("cont"):
            return try self.unpackContainsCompDescriptorWithOperand1(op1, operand2: op2)
        default:
            throw AEMErrorWithInfo(-1726, "Unknown comparison operator: \(desc)")
        }
    }

    override func unpackLogicalDescriptor(desc: NSAppleEventDescriptor) throws -> AnyObject { // TO DO: throw error -1726 if invalid operand(s)
        let operatorsDesc = desc.descriptorForKeyword(AEM4CC("term"))!.coerceToDescriptorType(AEM4CC("list"))! // keyAELogicalTerms, typeAEList
        let operatorCode = desc.descriptorForKeyword(AEM4CC("logc"))!.enumCodeValue // keyAELogicalOperator
        let op1 = try self.unpack(operatorsDesc.descriptorAtIndex(1)).aemQuery as! AEMTestClause
        switch operatorCode {
        case AEM4CC("AND "):
            operatorsDesc.removeDescriptorAtIndex(1)
            return op1.AND(try self.unpack(operatorsDesc))
        case AEM4CC("OR  "):
            operatorsDesc.removeDescriptorAtIndex(1)
            return op1.OR(try self.unpack(operatorsDesc))
        case AEM4CC("NOT "):
            return op1.NOT()
        default:
            throw AEMErrorWithInfo(-1726, "Unknown logical operator: \(desc)")
        }
    }
}

/******************************************************************************/
// Symbol base class
//
// Base class for all standard and application-specific type, enum, and property names (typeUnicodeText, cDocument, kAEYes, pName, etc).
//

// (note: while an enum would be idiomatic Swift, the need to map reliably between human-readable names and AE codes, and/or represent such mappings even when one or other is unavailable, may make this tricky or impractical; need to research further)

// TO DO: might be simpler for glues to subclass AEBSymbol, and define standard symbols as their own baseclass (Q. how best to generate that class? prob best done manually using glue generator, so that new types defined by Apple are permanently included in all subsequent framework releases)

class SwiftAESymbol: AEBSymbol {
    
    var aebPrefix: String {return "AEB"}
    
    override var description: String {
        if (self.aebName != nil) {
            return "\(self.aebPrefix).\(self.aebName)"
        } else {
            return "\(self.aebPrefix).symbolWithFourCharCode(\"\(AEMFormatOSType(self.aebCode))\")"
        }
    }
    
    // TO DO: construction is kinda messy
        class func symbolWithFourCharCode(code: String!) -> AEBSymbol { // convenience constructor; TO DO: how best to implement this? as convenience init? e.g. would it be better on glue, where exact type can be given?
        return self.aebSymbolForCode(AEM4CC(code))
    }
    
    /* begin generated section */
    
    override class func aebSymbolForCode(code_: OSType) -> AEBSymbol { // used by codecs to unpack AEDescs of typeType/typeEnumerated as named symbols (note: if a four-char code doesn't have a corresponding name, an AEBSymbol instance containing the raw code only is returned)
        switch code_ {
        //case AEM4CC("pnam"): return self.name
        // ... TO DO: standard codes
        default: return super.aebSymbolForCode(code_)
        }
    }
    
    /* Types and properties */
    //static let name: AEBSymbol = AEBSymbol(name: "color", type: AEM4CC("type"), code: AEM4CC("colr"))
    //class var name: SwiftAESymbol {return SwiftAESymbol(name: "color", type: AEM4CC("type"), code: AEM4CC("colr"))}
    // ...
    /* Enumerators */
    // ...
}


// shortcut for constructing standard symbols, e.g. AEB.unicodeText, AEB.list // currently unused
// let AEB = SwiftAESymbol.self



/******************************************************************************/
// misc constants used in SwiftAESpecifier

class AEBNoParameterValue {}

let AEBNoParameter = AEBNoParameterValue() // TO DO: what's easiest way to create unique symbol? (i.e. don't want to use nil to indicate omission of directParameter in commands, as that can't be distinguished from nil values returned by Cocoa APIs [e.g.] to signal a runtime error)

// command attributes

// timeout constants
let AEBNoTimeout: NSTimeInterval = -2
let AEBDefaultTimeout: NSTimeInterval = -1

typealias AEBReturnType = AnyObject // TO DO: more specific returnType
typealias AEBConsiderIgnoreType = [AEBSymbol]

typealias AEBEightCharCode = NSString
typealias AEBFourCharCode = String


// TO DO: not certain if using arrays of AEBSymbols to specify considers/ignores values is best choice; would a Swift enum be better?
// generally, mimicking AppleScript is the best approach; however, the kAE/kAS...Considers/IgnoresMask constants are hardcoded in ASRegistry.h, which are in turn copied in AEBDefaultTerms.m as part of AEB's 'default' terminology (itself modeled after AppleScript's own built-in terminology resource, and with much the same definitions), so it's not as if the user can supply non-standard symbols as command's considering/ignoring attributes, because those symbols need to be mapped to UInt32 bitmasks before they can be packed into an event (TBH, the fault is really with ASRegistry.h for adding a second, inflexible mechanism for specifying considering/ignoring flags, when there was already a simple, robust mechanism that took a single AEList of typeEnum descriptors)
let AEBConsidersAndIgnoresMasks: [OSType: (consider: UInt32, ignore: UInt32)] = [ // (AEBSymbol.code, ConsiderMask, IgnoreMask)
    AEM4CC("case"): (0x00000001, 0x00010000), // note: AEB.case, AEB.diacriticals, etc. symbols are defined in AEBDefaultTerms
    AEM4CC("diac"): (0x00000002, 0x00020000),
    AEM4CC("whit"): (0x00000004, 0x00040000),
    AEM4CC("hyph"): (0x00000008, 0x00080000),
    AEM4CC("expa"): (0x00000010, 0x00100000),
    AEM4CC("punc"): (0x00000020, 0x00200000),
    AEM4CC("nume"): (0x00000080, 0x00800000),
]

let kAEBDefaultConsidersIgnoresMask: UInt32 = 0x00010000 // AppleScript ignores case by default


// error keys // TO DO: merge AEM/AEB keys

let AEBErrorDomain: String = kAEMErrorDomain

let AEBErrorNumber                   = "ErrorNumber"
let AEBErrorMessage                  = "ErrorMessage"
let AEBErrorFailedCommandDescription = "FailedCommandDescription" // code representation of the failed command
let AEBErrorBriefMessage             = "BriefErrorMessage"
let AEBErrorExpectedType             = "ExpectedType"
let AEBErrorOffendingObject          = "OffendingObject"
let AEBErrorFailedAEMEvent           = "FailedAEMEvent"


class SwiftAECommandError: NSError {
    override var description: String {return self.localizedDescription} // avoid printing entire userInfo dict by default (too much detail)
    // TO DO: convenience getters for number (as OSStatus), message, etc.?
}


func ~= (left: SwiftAECommandError, right: Int) -> Bool { // TO DO: decide if this is best approach (should work for case; not sure about catch)
    return left.code == right
}


/******************************************************************************/
// Specifier base class
//
// Base class for glue-defined Specifier classes. Each application glue defines a custom Specifier class that implements
// property and elements getters, and command methods using names obtained from application's terminology (AETE/SDEF) resource.
// Invoking these getters constructs an AEMQuery using the corresponding four-char codes, then wraps both its AppData object
// and the new AEMQuery in a new Specifier instance. Invoking a command method creates a new AppleEvent instance, uses the
// AppData object to convert its arguments to AEDescs and packs those into the AE, dispatches the event, and finally unpacks the
// reply event's return value/raises an error.
//

class SwiftAESpecifier: AEBSpecifier {
    
    var aemQueryError: NSError? // captures, defers error if user creates malformed specifier, to be thrown if/when used in command
    
    convenience override init(appData: AEBAppData?, aemQuery: AEMQuery?) { // called by -[AEBStaticAppData unpackObjectSpecifier:error:]
        self.init(appData: appData, aemQuery: aemQuery, queryError: nil)
    }
    
    init(appData: AEBAppData?, aemQuery: AEMQuery?, queryError: NSError?) {
        aemQueryError = queryError
        super.init(appData: appData, aemQuery: aemQuery)
    }
    
    // TO DO: a better approach would be to pass a closure, e.g. {$0?[index]} which can be used to generate either new query or (using formatter) representation of malformed query
    
    // TO DO: sort out error messages; also make sure errors can't recurse, e.g. when displayed or packed into an AE (since `self` is the cause of the problem and cannot pack or display correctly); push error message creation into shared method
    
    // another issue is how to generate representation of malformed specifier for use in description? may be easiest if error description continues to construct representation, and if aemQuery==nil then description/formatter should just return that instead of building new one

    func aemObjectSpecifer(what: String) -> (AEMObjectSpecifier?, NSError?) {
        if aemQuery is AEMObjectSpecifier {
            return ((self.aemQuery as! AEMObjectSpecifier), nil)
        } else if aemQueryError == nil { // invalid specifier, e.g. TEDApp.documents[1][1]
            return (nil, NSError(domain: kAEMErrorDomain, code: -1728, userInfo: [
                    NSLocalizedDescriptionKey: "Can't \(what) of the following specifier (not an object specifier): \(self)",
                    kAEMErrorOffendingObjectKey: self]))
        } else {
            return (nil, aemQueryError)
        }
    }
    func aemElementsSpecifer(what: String) -> (AEMMultipleElementsSpecifier?, NSError?) {
        if aemQuery is AEMMultipleElementsSpecifier {
            return ((self.aemQuery as! AEMMultipleElementsSpecifier), nil)
        } else if aemQueryError == nil { // invalid specifier, e.g. TEDApp.documents.end.words
            return (nil, NSError(domain: kAEMErrorDomain, code: -1728, userInfo: [
                    NSLocalizedDescriptionKey: "Can't \(what) of the following specifier (not a multiple elements specifier): \(self)",
                    kAEMErrorOffendingObjectKey: self]))
        } else {
            return (nil, aemQueryError)
        }
    }
    func aemTestClause(what: String) -> (AEMTestClause?, NSError?) {
        if aemQuery is AEMTestClause {
            return ((self.aemQuery as! AEMTestClause), nil)
        } else if aemQueryError == nil { // invalid specifier, e.g. TEDApp.name && ...
            return (nil, NSError(domain: kAEMErrorDomain, code: -1728, userInfo: [
                    NSLocalizedDescriptionKey: "Can't \(what) of the following specifier (not a test  specifier): \(self)",
                    kAEMErrorOffendingObjectKey: self]))
        } else {
            return (nil, aemQueryError)
        }
    }
    
    override func packWithCodecs(codecs: AEMCodecsProtocol) throws -> NSAppleEventDescriptor {
        if (self.aemQuery != nil) {
            return try aemQuery.packWithCodecs(codecs)
        } else {
            throw aemQueryError ?? NSError(domain: kAEMErrorDomain, code: -1728, userInfo: [
                    NSLocalizedDescriptionKey: "Can't pack the following (not a valid specifier): \(self)",
                    kAEMErrorOffendingObjectKey: self])
        }
    }
    
    // note: clients may call the following method to send an event as a workaround if app's terminology is missing or incorrect
    func sendAppleEvent(eventCode: AEBEightCharCode, parameters: [AEBFourCharCode:AnyObject!],
                       returnType: AEBReturnType?, waitReply: Bool?, withTimeout: NSTimeInterval?,
                      considering: AEBConsiderIgnoreType?, ignoring: AEBConsiderIgnoreType?) throws -> AnyObject! {
        if eventCode.length != 8 {
            throw AEMErrorWithInfo(-1701, "Invalid event code (not 8-character string): \"\(eventCode)\"")
        }
        return try self.sendAppleEvent("«\(eventCode)»",
                             eventClass: AEM4CC(eventCode.substringToIndex(4)),
                                eventID: AEM4CC(eventCode.substringFromIndex(4)),
                             parameters: parameters.map { (code, value) in (name: "«\(code)»" as String?, code: AEM4CC(code), value: value) },
                        returnType: returnType, waitReply: waitReply, withTimeout: withTimeout, considering: considering, ignoring: ignoring)
    }
    
    
    func sendAppleEvent(name: String, eventClass: OSType, eventID: OSType, parameters: [(name: String?, code: OSType, value: AnyObject!)],
            returnType: AEBReturnType?, waitReply: Bool?, withTimeout: NSTimeInterval?,
            considering: AEBConsiderIgnoreType?, ignoring: AEBConsiderIgnoreType?) throws -> AnyObject! {
        if aebAppData == nil { // only concrete specifiers (i.e. created from an application object, not generic roots) can send events
            throw AEMErrorWithInfo(-1701, "Generic specifiers can't send commands: \(self)")
        }
        if aemQuery == nil { // malformed specifier, e.g. TextEdit().documents[1][1], so throw deferred error describing problem
            if aemQueryError == nil { // catch-all in case error hasn't been set for some reason
                throw NSError(domain: kAEMErrorDomain, code: -1728, userInfo: [
                    NSLocalizedDescriptionKey:"Can't call command on the following (not a valid specifier): \(self)",
                    kAEMErrorOffendingObjectKey: self])
            }
            throw aemQueryError!
        }
        // create Apple event and pack its parameters
        let command = AEBCommand(appData: aebAppData, eventClass: eventClass, eventID: eventID, parentQuery: aemQuery)
        for param in parameters {
            if !(param.value is AEBNoParameterValue) {
                command.setParameter(param.value, forKeyword: param.code)
            }
        }
        // pack event attributes
        if let type = returnType {
            if type is [AEBSymbol] {
                command.returnListOfType(type.code())
            } else if type is AEBSymbol {
                command.returnType(type.code())
            } else {
                print("TO DO: map common Swift types to corresponding AE types, and apply those as coercions while unpacking (note: this will require enhancements to AEBCommand)")
            }
        }
        if let reply = waitReply {
            if reply {
                command.waitForReply()
            } else {
                command.ignoreReply()
            }
        }
        if let timeout = withTimeout {
            if timeout == AEBDefaultTimeout {
                command.defaultTimeout()
            } else if timeout == AEBNoTimeout {
                command.noTimeout()
            } else {
                command.timeout(timeout as NSTimeInterval)
            }
        }
        // (note: most apps completely ignore enumConsidsAndIgnores attribute, and always ignore case and consider everything else)
        if considering != nil || ignoring != nil {
            var considersAndIgnores: UInt32 = 0
            if let considerOptions = considering {
                for symbol in considerOptions {
                    if let mask = AEBConsidersAndIgnoresMasks[symbol.aebCode] {
                        considersAndIgnores |= mask.consider
                    }
                }
            }
            if let ignoreOptions = ignoring {
                for symbol in ignoreOptions {
                    if let mask = AEBConsidersAndIgnoresMasks[symbol.aebCode] {
                        considersAndIgnores |= mask.ignore
                    }
                }
            }
            command.considering(considersAndIgnores)
        }
        // send the event
        //defer { print("SENT: \(try! SwiftAETranslateAppleEvent(command.aemEvent.descriptor, useSDEF: true))") } // TEST; TO DO: delete
        do {
            return try command.send()
        } catch {
            let aemError = error as NSError
            var args = [String]()
            for param in parameters {
                if !(param.value is AEBNoParameterValue) {
                    args.append((param.name != nil ? "\(param.name): " : "") + "\(SwiftAEFormatObject(param.value))")
                }
            }
            for (name, value) in [("returnType", returnType), ("waitReply", waitReply as Bool?),
                    ("withTimeout", withTimeout), ("considering", considering), ("ignoring", ignoring)] {
                if value != nil {
                    args.append("\(name): \(SwiftAEFormatObject(value))")
                }
            }
            let failedCommandDescription = "\(self).\(name)(" + ", ".join(args) + ")"
            var errorDescription = "Application command failed:\n\n\(failedCommandDescription)"
            var info: [NSObject: AnyObject] = [AEBErrorNumber:aemError.code, AEBErrorFailedCommandDescription: failedCommandDescription]
            let errorMessage = aemError.userInfo[kAEMErrorStringKey] ?? AEMDescriptionForError(Int32(aemError.code))
            if errorMessage != nil {
                info[AEBErrorMessage] = errorMessage!
                errorDescription += "\n\nError \(aemError.code): \(errorMessage!)"
            } else {
                errorDescription += "\n\nError \(aemError.code)."
            }
            info[NSLocalizedDescriptionKey] = errorDescription
            if let briefMessage = aemError.userInfo[kAEMErrorBriefMessageKey] {
                info[AEBErrorBriefMessage] = briefMessage
            }
            if let expectedType = aemError.userInfo[kAEMErrorExpectedTypeKey] {
                info[AEBErrorExpectedType] = expectedType // TO DO: also include in message? // TO DO: check if unpacked as AEM or AEB object
            }
            if let offendingObject = aemError.userInfo[kAEMErrorOffendingObjectKey] {
                info[AEBErrorOffendingObject] = offendingObject // TO DO: also include in message? // TO DO: check if unpacked as AEM or AEB object
            }
            if let failedAEMEvent = aemError.userInfo[kAEMErrorFailedEvent] {
                info[AEBErrorFailedAEMEvent] = failedAEMEvent
            }
            throw SwiftAECommandError(domain: kAEMErrorDomain, code: aemError.code, userInfo: info)
        }
    }
}

